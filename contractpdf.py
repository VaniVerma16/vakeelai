import os
import re
import json
import uuid
import requests
from fpdf import FPDF
from dotenv import load_dotenv
from flask import Blueprint, request, jsonify
from transformers import AutoTokenizer, AutoModel
import torch

load_dotenv()

contract_bp = Blueprint("contract", __name__)

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions"
HEADERS = {
    "Authorization": f"Bearer {OPENROUTER_API_KEY}",
    "Content-Type": "application/json"
}

# ====== InLegalBERT Setup ======
embedding_model_id = "law-ai/InLegalBERT"
embedding_tokenizer = AutoTokenizer.from_pretrained(embedding_model_id)
embedding_model = AutoModel.from_pretrained(embedding_model_id)

# ====== Clause Library ======
clause_library = {
    "nda": [
        "Confidential information shall be protected and not disclosed without prior consent.",
        "All proprietary data shared shall be returned or destroyed upon termination.",
        "Violation of confidentiality shall incur penalties under IT Act, 2000."
    ],
    "employment": [
        "Employment shall be subject to applicable labor laws and company policy.",
        "Notice period shall be 30 days unless otherwise mutually agreed.",
        "All employee IP contributions remain with the employer."
    ],
    "contractor": [
        "Contractor shall be responsible for tax and statutory compliance.",
        "Deliverables shall be owned by the client upon payment.",
        "Agreement may be terminated with 15 days' notice by either party."
    ],
    "sla": [
        "Service uptime shall not fall below 98% in any given month.",
        "Issues shall be resolved within 24 hours unless specified otherwise.",
        "Force majeure clauses shall apply during natural calamities."
    ],
    "partnership": [
        "Partners share profits and losses equally unless agreed otherwise.",
        "Bank accounts shall be jointly operated with dual signatories.",
        "Partnership may be dissolved upon mutual consent."
    ],
    "sales": [
        "Ownership of goods transfers upon full payment.",
        "All goods must comply with applicable BIS standards.",
        "Defective goods must be reported within 10 days of delivery."
    ],
    "lease": [
        "Premises shall not be sublet without prior written approval.",
        "Security deposit is refundable subject to condition of property.",
        "Maintenance responsibility lies with the lessee unless otherwise agreed."
    ],
    "mou": [
        "This document is a non-binding statement of intent.",
        "All mutual responsibilities shall be documented before execution.",
        "Parties agree to confidentiality until a formal agreement is signed."
    ],
    "noncompete": [
        "Employee shall not engage in similar employment within 1 year of exit.",
        "Restriction is limited to the state of employment.",
        "Violation shall result in damages to be determined by arbitration."
    ]
}

# ====== Clause Embedding and Selection ======
def get_embedding(text):
    inputs = embedding_tokenizer(text, return_tensors="pt", truncation=True, padding=True, max_length=512)
    with torch.no_grad():
        outputs = embedding_model(**inputs)
    return outputs.last_hidden_state.mean(dim=1).squeeze().numpy()

def retrieve_clause(query, contract_type):
    clauses = clause_library.get(contract_type, [])
    if not clauses:
        return "This Agreement shall be governed by the laws of India."

    query_emb = get_embedding(query)
    clause_embs = [get_embedding(cl) for cl in clauses]
    scores = [torch.cosine_similarity(torch.tensor(query_emb), torch.tensor(e), dim=0).item() for e in clause_embs]
    best_index = int(torch.tensor(scores).argmax())
    return clauses[best_index]

# ====== Mistral Refinement ======
def refine_clause_with_llm(clause, contract_type, city):
    refinement_prompt = f"""**Legal Clause Optimization Task**
    
As a senior Indian contract lawyer, improve this {contract_type} clause for maximum legal enforceability:

**Original Clause:**
"{clause}"
The city of jurisdiction is:
{city}
**Requirements:**
1. Explicitly reference relevant Indian laws/acts (IT Act 2000, Contract Act 1872, etc.)
2. Include clear obligations, remedies, termination conditions
3. Add sub-clauses for:
   - Governing law (Indian jurisdiction)
   - Dispute resolution (arbitration preferred)
   - Force majeure
4. Ensure compliance with latest amendments
5. Use precise legal terminology
6. Keep under 150 words
7. Disputes should be resolved in city of jurisdiction only.


**Example Output Structure:**
'The Parties agree that [specific obligation] per Section 43 of IT Act, 2000. In event of breach, [remedy] through arbitration in [city] under Arbitration Act, 1996.'"""

    payload = {
        "model": "mistralai/mistral-7b-instruct:free",
        "messages": [
            {"role": "system", "content": "You are a legal drafting expert specializing in Indian commercial contracts."},
            {"role": "user", "content": refinement_prompt}
        ],
        "temperature": 0.2,
        "max_tokens": 300
    }
    
    try:
        response = requests.post(OPENROUTER_API_URL, headers=HEADERS, json=payload, timeout=30)
        return response.json()['choices'][0]['message']['content'].strip() if response.status_code == 200 else clause
    except Exception as e:
        print(f"Refinement Error: {str(e)}")
        return clause
    
# ====== Template Generator ======
def get_legal_template(data, clause):
    A, B, D = data['party_a'], data['party_b'], data['duration']
    J = data.get('jurisdiction', 'New Delhi')
    T = data['contract_type']
    extra = {
        "position": data.get("position", ""),
        "property_address": data.get("property_address", ""),
        "goods_description": data.get("goods_description", ""),
        "scope": data.get("scope", "")
    }
    templates = {
        "nda": f"""NON-DISCLOSURE AGREEMENT\n\nThis Non-Disclosure Agreement is made between {A} and {B}.\n\n1. Term: {D}\n2. Confidentiality Obligations\n3. Legal Clause: {clause}\n4. Jurisdiction: {J}\n\nSigned: {A}, {B}""",
        "employment": f"""EMPLOYMENT AGREEMENT\n\nThis Employment Agreement is made between {A} and {B}.\n\n1. Position: {extra['position']}\n2. Duration: {D}\n3. Legal Clause: {clause}\n4. Jurisdiction: {J}\n\nSigned: {A}, {B}""",
        "contractor": f"""INDEPENDENT CONTRACTOR AGREEMENT\n\nThis Independent Contractor Agreement is made between {A} and {B}.\n\n1. Duration: {D}\n2. Role: Contractor\n3. Legal Clause: {clause}\n4. Jurisdiction: {J}\n\nSigned: {A}, {B}""",
        "sla": f"""SERVICE LEVEL AGREEMENT\n\nThis Service Level Agreement is made between {A} and {B}.\n\n1. Term: {D}\n2. Legal Clause: {clause}\n3. Jurisdiction: {J}\n\nSigned: {A}, {B}""",
        "partnership": f"""PARTNERSHIP AGREEMENT\n\nThis Partnership Agreement is made between {A} and {B}.\n\n1. Term: {D}\n2. Legal Clause: {clause}\n3. Jurisdiction: {J}\n\nSigned: {A}, {B}""",
        "sales": f"""SALES AGREEMENT\n\nThis Sales Agreement is made between {A} (Seller) and {B} (Buyer).\n\n1. Duration: {D}\n2. Goods/Services: {extra['goods_description']}\n3. Legal Clause: {clause}\n4. Jurisdiction: {J}\n\nSigned: {A}, {B}""",
        "lease": f"""LEASE AGREEMENT\n\nThis Lease Agreement is made between {A} (Lessor) and {B} (Lessee).\n\n1. Property: {extra['property_address']}\n2. Duration: {D}\n3. Legal Clause: {clause}\n4. Jurisdiction: {J}\n\nSigned: {A}, {B}""",
        "mou": f"""MEMORANDUM OF UNDERSTANDING\n\nThis Memorandum of Understanding is entered into by {A} and {B}.\n\n1. Term: {D}\n2. Legal Clause: {clause}\n3. Jurisdiction: {J}\n\nSigned: {A}, {B}""",
        "noncompete": f"""NON-COMPETE AGREEMENT\n\nThis agreement is between {A} and {B}.\n\n1. Duration: {D}\n2. Scope: {extra['scope']}\n3. Legal Clause: {clause}\n4. Jurisdiction: {J}\n\nSigned: {A}, {B}"""
    }
    return templates.get(T, "Invalid contract type.")

# ====== PDF Export ======
def save_as_pdf(content, filename="contract.pdf"):
    pdf = FPDF()
    pdf.set_auto_page_break(auto=True, margin=15)
    pdf.add_page()
    pdf.set_font("Arial", size=11)
    pdf.set_text_color(0, 0, 0)
    pdf.set_font("Arial", 'B', 16)
    pdf.cell(0, 10, "LEGAL CONTRACT DOCUMENT", 0, 1, 'C')
    pdf.ln(10)
    pdf.set_font("Arial", size=11)
    for line in content.split("\n"):
        pdf.multi_cell(0, 8, line)
    pdf.output(filename)

# ====== Flask Endpoint ======
@contract_bp.route("/generate", methods=["POST"])
def generate_contract():
    data = request.json
    try:
        clause_query = data.get("clause_query", "")
        contract_type = data.get("contract_type")
        city = data.get("jusridiction", "New Delhi")
        clause = retrieve_clause(clause_query, contract_type)
        refined = refine_clause_with_llm(clause, contract_type, city)
        contract = get_legal_template(data, refined)

        filename = "generated_contract.pdf"
        save_as_pdf(contract, filename)

        with open(filename, "rb") as f:
            upload_res = requests.post("https://store1.gofile.io/uploadFile", files={"file": f})

        if upload_res.status_code != 200:
            raise Exception("Upload failed to GoFile")

        res_json = upload_res.json()
        if res_json.get("status") != "ok":
            raise Exception("GoFile upload error")

        file_url = res_json["data"]["downloadPage"]

        return jsonify({
            "message": "Contract generated and uploaded.",
            "contract": contract,
            "pdf_url": file_url
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 400