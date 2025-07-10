const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const { showAsciiArt } = require('./utils/ascii');

const app = express();
const PORT = 3000;

const submissionsFile = path.join(__dirname, 'data', 'submissions.json');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const delayMiddleware = (req, res, next) => {
  setTimeout(next, 1000);
};

const challenges = [
  { id: 1, title: "Dance Battle", videoUrl: "https://dummyvideo.com/1", stickers: ["🔥", "💃", "🎶"] },
  { id: 2, title: "Lip Sync", videoUrl: "https://dummyvideo.com/2", stickers: ["🎤", "😂", "😎"] },
  { id: 3, title: "Comedy Skit", videoUrl: "https://dummyvideo.com/3", stickers: ["🤣", "🎭", "👍"] },
  { id: 4, title: "Magic Trick", videoUrl: "https://dummyvideo.com/4", stickers: ["✨", "🎩", "😲"] },
  { id: 5, title: "Fitness Challenge", videoUrl: "https://dummyvideo.com/5", stickers: ["💪", "🏋️", "🔥"] }
];

app.get('/challenges', (req, res) => {
  res.json(challenges);
});

app.post('/submissions', delayMiddleware, express.json(), (req, res) => {
  const { video, duration, stickers, challengeId } = req.body;

  if (!video || !duration || !challengeId) {
    return res.status(400).json({ error: "Missing fields in submission" });
  }

  if (Number(duration) > 15) {
    return res.status(400).json({ error: "Video exceeds 15 seconds" });
  }

  let parsedStickers = [];
  if (Array.isArray(stickers)) {
    parsedStickers = stickers;
  } else {
    try {
      parsedStickers = JSON.parse(stickers || "[]");
    } catch (err) {
      return res.status(400).json({ error: "Invalid stickers format. Must be an array or JSON array string." });
    }
  }

  const newSubmission = {
    id: Date.now(),
    video,
    duration,
    stickers: parsedStickers,
    challengeId,
    status: "pending"
  };

  let existing = [];
  if (fs.existsSync(submissionsFile)) {
    const data = fs.readFileSync(submissionsFile);
    existing = JSON.parse(data);
  }

  existing.push(newSubmission);
  fs.writeFileSync(submissionsFile, JSON.stringify(existing, null, 2));

  res.json("Submission pending review by moderator");
});

app.get('/submissions', (req, res) => {
  if (!fs.existsSync(submissionsFile)) {
    return res.json([]);
  }

  let data = JSON.parse(fs.readFileSync(submissionsFile));
  data = data.map(entry => ({
    ...entry,
    status: ["approved", "rejected", "pending"][Math.floor(Math.random() * 3)]
  }));

  res.json(data);
});

app.post('/preview', (req, res) => {
  const { video, duration } = req.body;

  if (!video || !duration) {
    return res.status(400).json({ error: "Missing fields" });
  }

  if (Number(duration) > 15) {
    return res.status(400).json({ error: "Video too long for preview" });
  }

  res.json({
    message: "Preview loaded",
    preview: {
      video,
      duration,
      thumbnail: "https://dummyimage.com/preview.png"
    }
  });
});

app.listen(PORT, () => {
  showAsciiArt();
  console.log(`🎉 Server running on http://localhost:${PORT}`);
});
