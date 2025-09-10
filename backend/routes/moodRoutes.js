const express = require('express');
const router = express.Router();
const Mood = require('../models/Mood');
const auth = require('../common/auth');

router.post('/add', auth, async (req, res) => {
  console.log('🚀 mood/add route hit');

  try {
    const { mood, date } = req.body;

    if (!mood || !date) {
      return res.status(400).json({ msg: 'Please provide both mood and date.' });
    }

    const newMood = new Mood({
      userId: req.user.id,
      mood,
      date,
    });

    await newMood.save();

    console.log('✅ Mood saved:', newMood);
    res.status(201).json({ message: 'Mood saved successfully', mood: newMood });

  } catch (err) {
    console.error('❌ Error saving mood:', err.stack || err);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

module.exports = router;
