from PyPDF2 import PdfReader
import os

def extract_text_from_pdf(pdf_path):
    """
    Extract text from a single PDF file.
    """
    reader = PdfReader(pdf_path)
    text = ""
    for page in reader.pages:
        text += page.extract_text()
    return text


def load_pdfs_from_folder(folder_path):
    """
    Load and combine text from all PDF files in a given folder.
    """
    combined_text = ""
    for file in os.listdir(folder_path):
        if file.endswith(".pdf"):
            combined_text += extract_text_from_pdf(os.path.join(folder_path, file))
    return combined_text
