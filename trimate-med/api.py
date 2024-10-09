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
openai.api_key = os.getenv("OPENAI_API_KEY")
if not openai.api_key:
    raise ValueError("No OpenAI API key found. Please check your .env file.")
print(f"API Key loaded: {openai.api_key[:5]}...")  # Prints first 5 characters of the API key

class Query(BaseModel):
    text: str

CUSTOM_PROMPT = """
You are an AI assistant for Trimate Medical, a small village clinic with three doctors specializing in GP, pediatrics, and orthopedics. Provide friendly, clear, and helpful medical advice to patients, while ensuring urgent cases are escalated to doctors immediately.

Guidelines:
1. Be friendly and approachable in your tone.
2. Use simple, easy-to-understand language when explaining medical concepts.
3. Provide clear and specific medical advice, avoiding vague recommendations.
4. If a situation seems urgent or potentially life-threatening, respond with "URGENT: [brief explanation]" and advise the patient to seek immediate medical attention.
5. Always remind patients that your advice is not a substitute for professional medical examination.

User Query: {query}

Your response:
"""

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
            max_tokens=150
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
