import os
import requests
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

def query_gemini_ai(prompt: str) -> str:
    """
    Queries the Gemini AI API to get a response for the prompt.
    
    Args:
        prompt (str): The input prompt to send to the Gemini AI API.
    
    Returns:
        str: The generated response or an error message.
    """
    # Retrieve the API key from environment variables
    api_key = os.getenv('API_KEY')
    
    if not api_key:
        return "Error: API key not found. Please set GEMINI_API_KEY in your .env file."
    
    # Actual Gemini AI API endpoint (you'll need to replace this with the real endpoint)
    url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent"
    
    headers = {
        "Content-Type": "application/json",
        "x-goog-api-key": api_key  # Google's Gemini API uses this header for authentication
    }
    
    data = {
        "contents": [{
            "parts": [{
                "text": prompt
            }]
        }],
        "generationConfig": {
            "maxOutputTokens": 100,
            "temperature": 0.7
        }
    }
    
    try:
        response = requests.post(url, json=data, headers=headers)
        response.raise_for_status()
        
        # Parse the response (Gemini API response structure might differ)
        response_json = response.json()
        generated_text = response_json['candidates'][0]['content']['parts'][0]['text']
        
        return generated_text
    
    except requests.exceptions.RequestException as e:
        return f"Network Error: {e}"
    except (KeyError, IndexError) as e:
        return f"Response Parsing Error: {e}"
    except Exception as e:
        return f"Unexpected Error: {e}"

# Example usage
if __name__ == "__main__":
    test_prompt = "Write a short poem about technology"
    result = query_gemini_ai(test_prompt)
    print(result)