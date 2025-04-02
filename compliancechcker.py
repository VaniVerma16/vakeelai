import json
import os
import tempfile
import pdfplumber
import numpy as np
import re
import ast
from flask import Flask, request, jsonify
from transformers import AutoTokenizer, AutoModel
from sklearn.metrics.pairwise import cosine_similarity
import torch
import requests
from dotenv import load_dotenv
load_dotenv()



from flask import Blueprint
compliance_bp = Blueprint("compliance", __name__)



analysis_result = {}

# Load InLegalBERT for embeddings
embedding_model_id = "law-ai/InLegalBERT"
embedding_tokenizer = AutoTokenizer.from_pretrained(embedding_model_id)
embedding_model = AutoModel.from_pretrained(embedding_model_id)

# OpenRouter API for LLM reasoning (Mistral)
OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions"
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")

headers = {
    "Authorization": f"Bearer {OPENROUTER_API_KEY}",
    "Content-Type": "application/json"
}
def load_legal_rules():
    try:
        # Get the path to the JSON file in the same directory
        json_file_path = os.path.join(os.path.dirname(__file__), 'extracted_text_laws.json')
        
        # Open and read the JSON file
        with open(json_file_path, 'r') as file:
            data = json.load(file)
            
        # Return the legal rules from the JSON file
        return data.get('legal_rules', [])
    except Exception as e:
        print(f"Error loading legal rules from JSON file: {e}")
        # Return empty list as fallback in case of error
        return []

# Get legal rules from JSON file
legal_rules = load_legal_rules()

# Now you can use legal_rules as before
# Example usage:
if legal_rules:
    print(f"Loaded {len(legal_rules)} legal rules from JSON file")
    for rule in legal_rules:
        print(f"Law ID: {rule['law_id']}")
else:
    print("No legal rules loaded from JSON file")
    
    
print("LEGAL RULES\n\n\n")
print(legal_rules)

# Get rule embeddings
SIMILARITY_THRESHOLD = 0.6

def get_embedding(text):
    inputs = embedding_tokenizer(text, return_tensors="pt", truncation=True, padding=True, max_length=512)
    with torch.no_grad():
        outputs = embedding_model(**inputs)
    embedding = outputs.last_hidden_state.mean(dim=1).squeeze()
    return embedding.numpy() if embedding.numel() > 0 else None

legal_rules_texts = [rule['law_text'] for rule in legal_rules]
legal_rules_embeddings = [get_embedding(text) for text in legal_rules_texts if get_embedding(text) is not None]
legal_rules_filtered = [rule for i, rule in enumerate(legal_rules) if get_embedding(legal_rules_texts[i]) is not None]

def extract_text(pdf_file):
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as temp_pdf:
            pdf_file.save(temp_pdf.name)
            text = ""
            with pdfplumber.open(temp_pdf.name) as pdf:
                text = "\n".join([page.extract_text() or "" for page in pdf.pages[:10]])
        os.remove(temp_pdf.name)
        if not text.strip():
            return None, "Extracted text is empty. Ensure the PDF is not scanned."
        return text, None
    except Exception as e:
        return None, str(e)

def analyze_contract(contract_text):
    clauses = [cl.strip() for cl in contract_text.split(".") if len(cl.strip()) > 20]
    return {"clauses": clauses}, None

def find_most_relevant_rule(clause):
    clause_embedding = get_embedding(clause)
    if clause_embedding is None or len(clause_embedding.shape) != 1:
        return {"law_text": "No valid embedding generated."}, 0.0

    similarities = cosine_similarity([clause_embedding], legal_rules_embeddings)[0]
    max_index = int(np.argmax(similarities))
    if similarities[max_index] < SIMILARITY_THRESHOLD:
        return {"law_text": "No sufficiently relevant legal rule found."}, similarities[max_index]
    return legal_rules_filtered[max_index], similarities[max_index]

def call_llm(prompt):
    payload = {
        "model": "mistralai/mistral-7b-instruct:free",
        "messages": [
            {"role": "system", "content": "You are a helpful Indian legal assistant."},
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.3
    }
    response = requests.post(OPENROUTER_API_URL, headers=headers, json=payload)
    if response.status_code == 200:
        return response.json()["choices"][0]["message"]["content"]
    else:
        print("LLM API Error:", response.status_code, response.text)
        return None

def extract_json(text):
    try:
        text = re.sub(r"```(?:json)?", "", text).strip()
        match = re.search(r"\{.*\}", text, re.DOTALL)
        if match:
            cleaned = match.group().replace('\n', ' ').replace('\r', '')
            return json.loads(cleaned)
        return ast.literal_eval(text)
    except Exception as e:
        print("JSON parsing error:", e)
        return None

def check_clause_violation(clause):
    matched_rule, similarity = find_most_relevant_rule(clause)
    reasoning_prompt = f"""
    As an Indian legal expert, analyze the following contract clause in relation to the specified legal rule. Determine if the clause violates the rule and explain your reasoning.

    Clause: "{clause}"
    Legal Rule: "{matched_rule['law_text']}"

    Provide your answer in JSON format:
    {{
        "Clause": "{clause}",
        "Legal Rule": "{matched_rule['law_text']}",
        "Violates": "YES or NO",
        "Reason": "<brief reasoning>"
    }}
    """

    response_text = call_llm(reasoning_prompt)
    if not response_text:
        return {
            "Clause": clause,
            "Legal Rule": matched_rule['law_text'],
            "Violates": "UNKNOWN",
            "Reason": "LLM inference failed"
        }

    parsed = extract_json(response_text)
    if parsed:
        return parsed
    else:
        return {
            "Clause": clause,
            "Legal Rule": matched_rule['law_text'],
            "Violates": "UNKNOWN",
            "Reason": "Could not parse LLM response: " + response_text[:200] + ("..." if len(response_text) > 200 else "")
        }

@compliance_bp.route('/upload', methods=['POST'])
def upload_contract():
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    contract_text, error = extract_text(file)
    if error:
        return jsonify({"error": error}), 400

    clauses_json, error = analyze_contract(contract_text)
    if error:
        return jsonify({"error": error}), 500

    results = {}
    for clause in clauses_json.get("clauses", []):
        results[clause] = check_clause_violation(clause)

    return jsonify(results)

@compliance_bp.route("/check_violation", methods=["POST"])
def check_violation():
    clauses = request.json.get("clauses", [])
    results = {}
    for clause in clauses:
        results[clause] = check_clause_violation(clause)
    return jsonify(results)