#app.py
from flask import Flask, request, jsonify
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from pymongo import MongoClient
from flask_cors import CORS
from bson import ObjectId
import datetime
from textblob import TextBlob
# from transformers import AutoModelForCausalLM, AutoTokenizer
# import torch
import google.generativeai as genai

app = Flask(__name__)
app.config['JWT_SECRET_KEY'] = 'your_jwt_secret_key'  # Change this to a secure key
CORS(app)

bcrypt = Bcrypt(app)
jwt = JWTManager(app)

# MongoDB connection
client = MongoClient('mongodb://localhost:27017/')
db = client['journal_db']
users_collection = db['users']
entries_collection = db['entries']
chat_sessions_collection = db['chat_sessions']


# Configure the Gemini API
genai.configure(api_key="YOUR API KEY")

# Load the model and tokenizer
# model_id = "mistralai/Mistral-Nemo-Instruct-2407"
# tokenizer = AutoTokenizer.from_pretrained(model_id)
# model = AutoModelForCausalLM.from_pretrained(model_id, torch_dtype=torch.bfloat16, device_map="auto")

# Sign Up Route
@app.route('/sign-up', methods=['POST'])
def sign_up():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    
    if users_collection.find_one({'email': email}):
        return jsonify({"msg": "User already exists"}), 400
    
    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    users_collection.insert_one({'email': email, 'password': hashed_password})
    
    return jsonify({"msg": "User created successfully"}), 201

# Sign In Route
@app.route('/sign-in', methods=['POST'])
def sign_in():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    user = users_collection.find_one({'email': email})
    if not user or not bcrypt.check_password_hash(user['password'], password):
        return jsonify({"msg": "Invalid email or password"}), 401

    access_token = create_access_token(identity=email)
    return jsonify(access_token=access_token), 200

# Save Journal Entry Route
@app.route('/save-entry', methods=['POST'])
@jwt_required()
def save_entry():
    current_user = get_jwt_identity()
    data = request.get_json()
    content = data.get('content')
    
    entry = {
        'user_email': current_user,
        'content': content,
        'date': datetime.datetime.utcnow()
    }
    
    result = entries_collection.insert_one(entry)
    
    return jsonify({"msg": "Entry saved successfully", "id": str(result.inserted_id)}), 201

# Get Journal Entries Route
@app.route('/get-entries', methods=['GET'])
@jwt_required()
def get_entries():
    current_user = get_jwt_identity()
    
    entries = list(entries_collection.find({'user_email': current_user}).sort('date', -1))
    
    # Convert ObjectId to string for JSON serialization
    for entry in entries:
        entry['_id'] = str(entry['_id'])
        entry['date'] = entry['date'].isoformat()
    
    return jsonify(entries), 200

from textblob import TextBlob

@app.route('/get-sentiment-data', methods=['GET'])
@jwt_required()
def get_sentiment_data():
    current_user = get_jwt_identity()
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    
    start = datetime.datetime.fromisoformat(start_date.replace('Z', '+00:00'))
    end = datetime.datetime.fromisoformat(end_date.replace('Z', '+00:00'))
    
    entries = entries_collection.find({
        'user_email': current_user,
        'date': {'$gte': start, '$lte': end}
    })
    
    sentiment_data = {}
    for entry in entries:
        # Use the date in UTC, but format it as a string in the local timezone
        date = entry['date'].replace(tzinfo=datetime.timezone.utc)
        local_date = date.astimezone().date()
        date_str = local_date.isoformat()
        
        content = entry['content']
        sentiment = TextBlob(content).sentiment.polarity
        
        if date_str in sentiment_data:
            sentiment_data[date_str].append(sentiment)
        else:
            sentiment_data[date_str] = [sentiment]
    
    # Calculate average sentiment for each date
    average_sentiment_data = {
        date: sum(sentiments) / len(sentiments)
        for date, sentiments in sentiment_data.items()
    }
    
    return jsonify(average_sentiment_data), 200


@app.route('/api/chat', methods=['POST'])
@jwt_required() 
def chat():
    print("Received request at /api/chat")  # Debug print
    data = request.get_json()
    print("Request data:", data)  # Debug print
    user_message = data.get('message')

    # Get the current user from JWT token
    current_user = get_jwt_identity()

    # Configure the model
    model = genai.GenerativeModel('gemini-pro')

    # Prepare the chat
    chat = model.start_chat(history=[])

    # Generate a response
    response = chat.send_message(f"Respond to the following user message in a supportive, very POLITE, empathetic, and friendly tone. Ensure the response is CONCISE and avoid overly formal language. {user_message}")
    assistant_response = response.text

    # Save chat as a journal entry
    entry = {
        'user_email': current_user,
        'content': f"User: {user_message}\nDiary: {assistant_response}",
        'date': datetime.datetime.utcnow()
    }
    entries_collection.insert_one(entry)

    return jsonify({"response": assistant_response})


if __name__ == '__main__':
    app.run(debug=True)