require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const OpenAI = require("openai");

const app = express();

const todo = require('./utils/todo/td_routes');
const chat = require('./utils/chat/chat_routes');
const userRoutes = require('./utils/Login/login_routes');
const moodRoutes = require('./routes/moodRoutes'); // ✅ Add this
const auth = require('./common/auth');

app.use(bodyParser.json());

app.use('/user', userRoutes);

// protected routes
app.use('/todos', auth, todo);
app.use('/chat', auth, chat);
app.use('/api/moods', moodRoutes); // ✅ Add this line

module.exports = app;
