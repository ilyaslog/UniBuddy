from InstructorEmbedding import INSTRUCTOR

model = INSTRUCTOR('hkunlp/instructor-xl')


def generate_embedding(text, instruction="Represent the content meaning:"):
    """
    Generate an embedding for a given text using the instructor model.
    """
    return model.encode([[instruction, text]])[0]
