from flask import Flask
from contractpdf import contract_bp
from compliancechcker import compliance_bp
from riskanalyser import risk_bp

import os
from flask_cors import CORS

app = Flask(__name__)
CORS(app) 

# Register blueprints
app.register_blueprint(contract_bp, url_prefix="/contract")
app.register_blueprint(compliance_bp, url_prefix="/compliance")
app.register_blueprint(compliance_bp, url_prefix="/risk")


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
