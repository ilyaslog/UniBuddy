if __name__ == "__main__":
    with open("IoT-Chapitre1.pdf", "rb") as f: 
        query = "generate me a quizz about this document of 5 questions with the answers bellow?"
        response = handle_query(f, query)
        print("AI Response:", response)
