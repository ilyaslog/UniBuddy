from azure.storage.blob import BlobServiceClient
from io import BytesIO

# Configuration Azure Blob Storage
AZURE_CONNECTION_STRING = "DefaultEndpointsProtocol=https;AccountName=pdfunibuddy;AccountKey=accountkey;EndpointSuffix=core.windows.net"
AZURE_CONTAINER_NAME = "pdf"

# Initialisation du client Azure Blob Service
blob_service_client = BlobServiceClient.from_connection_string(AZURE_CONNECTION_STRING)
container_client = blob_service_client.get_container_client(AZURE_CONTAINER_NAME)

def upload_to_blob(file_name, file_content):
    """
    Uploads a file to Azure Blob Storage.
    """
    try:
        blob_client = container_client.get_blob_client(file_name)
        blob_client.upload_blob(file_content, overwrite=True)
        return f"Blob {file_name} uploaded successfully."
    except Exception as e:
        return f"Error uploading to Azure Blob Storage: {str(e)}"

def download_from_blob(file_name):
    """
    Downloads a file from Azure Blob Storage.
    """
    try:
        blob_client = container_client.get_blob_client(file_name)
        blob_data = blob_client.download_blob()
        return BytesIO(blob_data.readall())
    except Exception as e:
        return f"Error downloading from Azure Blob Storage: {str(e)}"