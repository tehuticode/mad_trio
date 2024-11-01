from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
from dotenv import load_dotenv
import openai

# Load environment variables
load_dotenv()

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Set up OpenAI API
openai.api_key = os.getenv("GPT4_MINI_API_KEY")
if not openai.api_key:
    raise ValueError("No OpenAI API key found. Please check your .env file.")
print(f"API Key loaded: {openai.api_key[:5]}...")  # Prints first 5 characters of the API key

class Query(BaseModel):
    text: str

CUSTOM_PROMPT = """
You are a bot that generates exactly 50 unique training phrases based on two input phrases provided by the user. The output should be formatted in JSON with each phrase labeled in a sequence from 1 to 50.

The user will input two training phrases, which serve as the basis for the variations you create.

**Generation Techniques**:
1. Use synonyms to replace key verbs, nouns, and adjectives, maintaining the phrase's meaning.
2. Modify sentence structures by changing grammatical moods and using active/passive voices.
3. Create both formal and informal tone variations.
4. Combine parts of the input phrases in new ways.

**Example Inputs**:
1. "I want to make a booking"
2. "Can I make a booking?"

**Output Format**:
{ "intent": "booking appointment", "training_phrases": [ {"phrase_1": "I would like to book an appointment."}, {"phrase_2": "Can I book an appointment?"}, {"phrase_3": "I'd like to schedule a booking."}, ... {"phrase_50": "Please assist me in making a reservation."} ] }
Please ensure there are exactly 50 phrases.
"""

# CUSTOM_PROMPT = """
# You are a bot that generates 50 training phases based on two input phrases provided by the user. Output the result in JSON format
# The user will input two training phrases that will be used as starting points for the training phrases.

# Example inputs:
# I want to make a booking,
# Can I make a booking?

# Techniques:
# Identify the verbs, nouns and adjectives in the phrases. Use synonyms to replace key verbs, nouns, and adjectives to create variety in the prompts, making sure the meaning of the phrases remains unchanged.
# Change the sentence structure, via switching the gramatical moods between indicative and imperative.
# Make use of active and passive voicings.
# Vary between formal and informal tones.
# Merge the input phrases to make new sentences.

# Apply the above techniques to generate 50 unique training phrases.
# Output the result as an array of objects in JSON Format, where each object has a phrase key with a unique index value.
# Include an intent field at the beginning of the object that describes the purpose of the phrases. example: "booking appointment"
# Example JSON output format:
# {
# "intent":"booking_appointment"
# "training_phrases": [
# {"phrase_1": "I would like to book an appointment."},
# {"phrase_2": "Can I book an appointment?"},
# {"phrase_3": "I'd like to book an appointment."},
# etc.
# ]
# }
# """

@app.get("/")
async def root():
    return {"message": "Welcome to the Trimate Medical Chatbot API"}

@app.post("/chat")
async def chat(query: Query):
    try:
        print(f"Received query: {query}")
        user_query = query.text
        
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": CUSTOM_PROMPT},
                {"role": "user", "content": user_query}
            ],
            max_tokens=2048
        )
        print(f"OpenAI API Response type: {type(response)}")
        print(f"OpenAI API Response content: {response}")

        if isinstance(response, dict):
            if 'choices' in response and len(response['choices']) > 0:
                if 'message' in response['choices'][0] and 'content' in response['choices'][0]['message']:
                    return {"response": response['choices'][0]['message']['content']}
                else:
                    print(f"Unexpected structure in choices: {response['choices'][0]}")
            else:
                print(f"No 'choices' in response or empty choices")
        else:
            print(f"Response is not a dictionary. Type: {type(response)}")

        return {"response": "I'm sorry, I couldn't generate a response. Please try again."}

    except Exception as e:
        print(f"Exception occurred: {type(e).__name__}, {str(e)}")
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
