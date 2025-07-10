# Gigglle Challenge Server

A simple Express.js backend for handling video challenge submissions and previews. This project simulates a backend for a social app where users can submit short videos to themed challenges, along with stickers and durations.

---

## 🚀 Setup Instructions

## 1. Clone the repository

git clone https://github.com/your-username/gigglle-backend.git
cd gigglle-backend

## 2. Run the project

npm install
npm start

The server will start on:

http://localhost:3000



## Features completed

GET /challenges: Returns a list of predefined challenges with title, video URL, and stickers.

POST /submissions: Accepts a video submission with validation:

    Video duration must be ≤ 15 seconds.

    Challenge ID must be present.

    Stickers must be an array or a stringified JSON array.

    Stores submission data to data/submissions.json.

GET /submissions: Returns list of all submissions with randomized status (pending, approved, rejected).

POST /preview: Accepts a video and duration, and returns a preview response if duration ≤ 15 seconds.

Middleware delay of 1s simulates network latency.

ASCII banner on server start.



## 🧪 API Test Samples (cURL)

🔹 1. Get all challenges

curl http://localhost:3000/challenges

🔹 2. Submit a valid challenge

curl -X POST http://localhost:3000/submissions \
  -H "Content-Type: application/json" \
  -d '{
    "video": "my-awesome-video.mp4",
    "duration": 14,
    "challengeId": 1,
    "stickers": ["🔥", "🎉"]
  }'

🔹 3. Submit with too long duration (invalid)

curl -X POST http://localhost:3000/submissions \
  -H "Content-Type: application/json" \
  -d '{
    "video": "too-long.mp4",
    "duration": 20,
    "challengeId": 2,
    "stickers": ["😵"]
  }'

🔹 4. Get all submissions

curl http://localhost:3000/submissions

🔹 5. Preview a video (form-data)

curl -X POST http://localhost:3000/preview \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "video=my-preview.mp4&duration=10"
