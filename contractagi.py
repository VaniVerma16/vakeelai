import os
import requests
import re
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langchain.agents import create_react_agent, AgentExecutor, tool
from langchain import hub
from flask import Blueprint, request, jsonify
from pydantic import BaseModel
from fpdf import FPDF

load_dotenv()

# ==== Flask Blueprint ====
contract_bp = Blueprint("contract", __name__, url_prefix="/contract")

# ==== Configuration ====
GROQ_MODEL = "deepseek-r1-distill-qwen-32b"

llm = ChatGroq(api_key=os.getenv("GROQ_API_KEY"), model=GROQ_MODEL, temperature=0.7,  # More deterministic output
    max_tokens=1024,  # Prevent excessive generation
    timeout=30 )

# ==== Tool Schemas ====
class GenerateClauseInput(BaseModel):
    contract_type: str
    jurisdiction: str
    scope: str = ""

class ContractTemplateInput(BaseModel):
    parties: dict
    duration: str
    jurisdiction: str
    contract_type: str
    clause: str

class PDFGenerationInput(BaseModel):
    contract_content: str
    filename: str = "generated_contract.pdf"
    contract_metadata: dict = {}  # Add metadata for better PDF formatting

class UploadToGoFileInput(BaseModel):
    filepath: str

# ==== Tools ====
@tool(args_schema=GenerateClauseInput)
def generate_clause(contract_type: str, jurisdiction: str, scope: str = ""):
    """
    Generate a legally enforceable clause based on the latest relevant Indian laws.

    Args:
        contract_type: Type of contract (e.g., noncompete, employment).
        jurisdiction: Legal jurisdiction.
        scope: Optional scope description for noncompete clauses.

    Returns:
        str: Generated legal clause.
    """
    scope_info = f" The scope of noncompete is specifically {scope}." if scope else ""
    prompt = (
        f"As a senior Indian legal expert, draft a robust, enforceable legal clause "
        f"for a {contract_type} agreement applicable in {jurisdiction}.{scope_info} "
        "Explicitly reference current relevant Indian acts, laws, include clear obligations, "
        "remedies, termination conditions, governing law, dispute resolution (arbitration), "
        "and force majeure clauses. Keep concise, precise, under 150 words.Return in a pdf friendly format. DON'T RETURN YOUR REASONING PROCESS ONLY THE CONTRACT."
    )
    response = llm.invoke(prompt)
    return response.content.strip()

# Helper function to clean the contract output
def clean_contract_output(contract_text):
    # Remove <think>...</think> blocks
    cleaned_text = re.sub(r'<think>.*?</think>', '', contract_text, flags=re.DOTALL)
    # Remove consecutive blank lines
    cleaned_text = re.sub(r'\n{3,}', '\n\n', cleaned_text)
    
    # Replace problematic Unicode characters with ASCII equivalents
    replacements = {
        '’': "'",   # Right single quote
        '‘': "'",   # Left single quote
        '“': '"',   # Left double quote
        '”': '"',   # Right double quote
        '–': '-',   # En-dash
        '—': '-',   # Em-dash
        '₹': 'Rs.', # Rupee symbol
        '…': '...', # Ellipsis
        '•': '-',   # Bullet
        ' ': ' ',   # Non-breaking space
    }

    for unicode_char, ascii_char in replacements.items():
        cleaned_text = cleaned_text.replace(unicode_char, ascii_char)
    
    # Remove any other remaining non-Latin-1 characters
    cleaned_text = cleaned_text.encode('latin-1', 'ignore').decode('latin-1')
    
    return cleaned_text.strip()

@tool(args_schema=ContractTemplateInput)
def contract_template(parties: dict, duration: str, jurisdiction: str, contract_type: str, clause: str):
    """
    Generate the final structured contract.

    Args:
        parties: Dictionary with 'party_a' and 'party_b'.
        duration: Duration of the contract.
        jurisdiction: Legal jurisdiction.
        contract_type: Type of contract.
        clause: Generated legal clause.

    Returns:
        str: Structured contract content.
    """
    # Clean any thinking sections from the clause before using it
    cleaned_clause = clean_contract_output(clause)
    
    content = f"""
{contract_type.upper()} AGREEMENT

This {contract_type.capitalize()} Agreement is made between {parties['party_a']} and {parties['party_b']}.

1. Duration: {duration}
2. Jurisdiction: {jurisdiction}
3. Legal Clause:
{cleaned_clause}

Signed:
{parties['party_a']} | {parties['party_b']}
"""
    return content.strip()

@tool(args_schema=PDFGenerationInput)
def pdf_generation(contract_content: str, filename: str = "generated_contract.pdf", contract_metadata: dict = {}):
    """
    Generate a professional-looking PDF from contract content with UTF-8 support.
    """
    pdf = FPDF()
    pdf.add_page()
    pdf.set_auto_page_break(auto=True, margin=15)

    # Use a Unicode-capable font (DejaVuSans)
    pdf.add_font("DejaVu", "", "DejaVuSans.ttf", uni=True)
    pdf.add_font("DejaVu", "B", "DejaVuSans-Bold.ttf", uni=True)

    contract_type = contract_metadata.get("contract_type", "").upper()

    # Title
    pdf.set_font("DejaVu", "B", 16)
    pdf.cell(0, 10, f"{contract_type} AGREEMENT", 0, 1, "C")
    pdf.ln(5)

    # Content
    pdf.set_font("DejaVu", "", 12)
    lines = contract_content.split("\n")
    for line in lines:
        if line.strip().upper() == f"{contract_type} AGREEMENT":
            continue
        elif line.strip().startswith("This") and "Agreement is made between" in line:
            pdf.set_font("DejaVu", "B", 12)
            pdf.multi_cell(0, 10, line)
            pdf.ln(5)
            pdf.set_font("DejaVu", "", 12)
        elif line.strip().startswith("Signed:"):
            pdf.ln(10)
            pdf.set_font("DejaVu", "B", 12)
            pdf.cell(0, 10, line, 0, 1)
        elif line.strip() and line[0].isdigit() and ". " in line[:5]:
            pdf.set_font("DejaVu", "B", 12)
            pdf.multi_cell(0, 10, line)
            pdf.set_font("DejaVu", "", 12)
        elif line.strip().startswith("**") and line.strip().endswith("**"):
            pdf.set_font("DejaVu", "B", 12)
            cleaned_line = line.strip().replace("**", "")
            pdf.multi_cell(0, 10, cleaned_line)
            pdf.set_font("DejaVu", "", 12)
        elif line.strip():
            pdf.multi_cell(0, 10, line)

    pdf.output(filename)
    return filename

@tool(args_schema=UploadToGoFileInput)
def upload_to_gofile(filepath: str):
    """
    Upload PDF file to GoFile.io.

    Args:
        filepath: Path to the PDF file.

    Returns:
        str: URL to uploaded PDF.
    """
    with open(filepath, "rb") as f:
        response = requests.post("https://store1.gofile.io/uploadFile", files={"file": f})
    res_json = response.json()
    if response.status_code == 200 and res_json.get("status") == "ok":
        return res_json["data"]["downloadPage"]
    else:
        raise Exception("GoFile upload failed.")

# ==== Initialize Agent ====
prompt_template = hub.pull("hwchase17/react")

tools = [
    generate_clause,
    contract_template,
    pdf_generation,
    upload_to_gofile
]

agent = create_react_agent(llm, tools, prompt_template)
agent_executor = AgentExecutor(agent=agent, tools=tools, verbose=True)

# ==== Flask Endpoint ====
@contract_bp.route("/generate", methods=["POST"])
def generate_contract():
    data = request.json
    required_fields = ["party_a", "party_b", "duration", "jurisdiction", "contract_type"]
    if not all(field in data for field in required_fields):
        return jsonify({"error": "Missing required fields"}), 400

    try:
        # Extract all data provided by the user
        contract_type = data['contract_type']
        jurisdiction = data['jurisdiction']
        party_a = data['party_a']
        party_b = data['party_b']
        duration = data['duration']
        scope = data.get('scope', '')
        
        # Generate clause
        clause = generate_clause.invoke({
            "contract_type": contract_type,
            "jurisdiction": jurisdiction,
            "scope": scope
        })

        # Generate contract
        contract = contract_template.invoke({
            "parties": {
                "party_a": party_a,
                "party_b": party_b
            },
            "duration": duration,
            "jurisdiction": jurisdiction,
            "contract_type": contract_type,
            "clause": clause
        })

        # Clean the contract output to remove any thinking sections
        cleaned_contract = clean_contract_output(contract)

        # Generate PDF with the cleaned contract and metadata for better formatting
        filename = pdf_generation.invoke({
            "contract_content": cleaned_contract,
            "filename": f"{contract_type.lower()}_agreement_{party_a.split()[0].lower()}_{party_b.split()[0].lower()}.pdf",
            "contract_metadata": {
                "contract_type": contract_type,
                "jurisdiction": jurisdiction,
                "party_a": party_a,
                "party_b": party_b,
                "duration": duration
            }
        })

        # Upload to GoFile
        file_url = upload_to_gofile.invoke({
            "filepath": filename
        })

        return jsonify({
            "message": "Contract generated and uploaded.",
            "contract": cleaned_contract,
            "pdf_url": file_url
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500