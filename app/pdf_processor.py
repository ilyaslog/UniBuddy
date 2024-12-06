from PyPDF2 import PdfReader

def process_document(pdf_file):
    try:
        print("Reading PDF...")
        pdf_reader = PdfReader(pdf_file)
        text = ""
        for i, page in enumerate(pdf_reader.pages):
            page_text = page.extract_text()
            if page_text:
                print(f"Page {i+1} extracted: {len(page_text)} characters")
                text += page_text + "\n"
            else:
                print(f"Page {i+1} has no text.")
        
        # Split the text into chunks (e.g., 500 characters per chunk)
        chunk_size = 500
        chunks = [
            {"page_content": text[i:i+chunk_size], "metadata": {"page": i // chunk_size + 1}}
            for i in range(0, len(text), chunk_size)
        ]

        print(f"Generated {len(chunks)} chunks.")
        return chunks
    except Exception as e:
        print(f"Error processing document: {e}")
        raise
