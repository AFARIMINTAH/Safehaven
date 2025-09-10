// controllers/moodController.js
const Mood = require('../models/Mood');

// POST /api/moods - Add a mood
exports.createMood = async (req, res) => {
  try {
    const { userId, mood, note } = req.body;

    const newMood = new Mood({ userId, mood, note });
    await newMood.save();

    res.status(201).json({ message: 'Mood recorded successfully', mood: newMood });
  } catch (err) {
    res.status(500).json({ error: 'Failed to record mood' });
  }
};

// GET /api/moods/:userId - Get all moods for a user
exports.getMoodsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const moods = await Mood.find({ userId }).sort({ timestamp: -1 });

    res.status(200).json(moods);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch moods' });
  }
};
