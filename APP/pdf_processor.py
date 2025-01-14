import pdfplumber
from io import BytesIO

def extract_pdf_chunks(file_content):
    """
    Extracts text from a PDF file content.
    """
    try:
        extracted_text = ""
        with pdfplumber.open(file_content) as pdf:
            for page in pdf.pages:
                text = page.extract_text()
                if text:
                    extracted_text += text + "\n"
        if not extracted_text.strip():
            return "Error: The PDF file contains no text."
        return extracted_text
    except Exception as e:
        return f"Error while processing the PDF: {e}"