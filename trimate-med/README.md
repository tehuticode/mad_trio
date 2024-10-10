# Trimate Medical Chatbot

A simple medical chatbot API using FastAPI and GPT-4o mini.

## Description

This project implements a chatbot for Trimate Medical, a small village clinic. The chatbot provides friendly, clear, and helpful medical advice to patients, while ensuring urgent cases are escalated to doctors immediately. It uses a locally hosted or alternative version of GPT-4, specifically GPT-4 mini.

## Features

- FastAPI backend for handling chat requests
- Integration with GPT-4 mini
- Simple HTML/JavaScript frontend for interaction
- Customizable prompt for medical advice

## Prerequisites

- Python 3.8+
- Access to GPT-4 mini API


## Installation

1. Clone the repository:
   ```
   git clone git@github.com:tehuticode/mad_trio.git
   cd trimate-medical-chatbot
   ```

2. Create a virtual environment and activate it:
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```

3. Install the required packages:
   ```
   pip install -r requirements.txt
   ```

4. Create a `.env` file in the project root and add your GPT-4 mini API key or connection details:
   ```
   GPT4_MINI_API_KEY=your_api_key_here
   ```

## Usage

1. Start the FastAPI server:
   ```
   python api.py
   ```

2. Open `index.html` in a web browser to interact with the chatbot.

   If using a terminal, you can use:
   ```
   xdg-open index.html  # On Linux with a desktop environment
   ```
   Or start a Python HTTP server:
   ```
   python -m http.server 8000
   ```
   Then open `http://localhost:8000/index.html` in your browser.

3. You can also interact with the API directly using curl:
   ```
   curl -X POST "http://127.0.0.1:8000/chat" -H "Content-Type: application/json" -d '{"text":"What are the symptoms of a cold?"}'
   ```

## API Endpoints

- `GET /`: Welcome message
- `POST /chat`: Send a message to the chatbot
  - Request body: `{"text": "Your message here"}`
  - Response: `{"response": "Chatbot's response here"}`

## Customization

You can modify the `CUSTOM_PROMPT` in `api.py` to change the chatbot's behavior and guidelines.


## Acknowledgments

_Perry, Michael, Adam_
