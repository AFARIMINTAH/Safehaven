require('dotenv').config();
const axios = require('axios');

// Store sessions with chat history
const sessions = {};

// Curated feel-good/funny YouTube links
const videoLinks = [
  "https://youtu.be/d-diB65scQU", // Pharrell - Happy (feel good)
  "https://youtu.be/tVj0ZTS4WF4", // LMFAO - Party Rock Anthem
  "https://youtu.be/9bZkp7q19f0", // Gangnam Style (classic funny)
  "https://youtu.be/CduA0TULnow", // Britney Spears - Sometimes (soothing)
  "https://youtu.be/Lr31dZmLQxQ", // Animals being jerks compilation
  "https://youtu.be/fLexgOxsZu0", // Bruno Mars - Uptown Funk
  "https://youtu.be/dQw4w9WgXcQ", // Rickroll 😏
  "https://youtu.be/J---aiyznGQ", // Dramatic Chipmunk
  "https://youtu.be/l-gQLqv9f4o", // Kid President Pep Talk
  "https://youtu.be/PWgvGjAhvIw", // Crazy Frog - Axel F
];

// System prompt for personality + link-suggestion
const systemPrompt = {
  role: 'system',
  content: `
You are SafeHaven, a kind, supportive, and uplifting AI mental health companion.

Your job is to:
1. Offer emotional support and encouragement when users feel sad, anxious, or tired.
2. Use gentle, empathetic language and a warm tone. Include emojis when appropriate 😊.
3. Occasionally suggest a short funny or feel-good video from YouTube — and ALWAYS include a direct link from this list:
${videoLinks.map((link) => `   - ${link}`).join("\n")}
4. Only use real, common videos or well-known links. Do not make up fake URLs.
5. Never give medical or clinical advice — instead, gently recommend seeing a professional when needed.

Keep your responses warm, encouraging, and human-like.
`
};

const createchat = async (req, res) => {
  try {
    const { message, sessionId = 'default_session' } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Invalid message format.' });
    }

    // Initialize session if it's new
    if (!sessions[sessionId]) {
      sessions[sessionId] = [systemPrompt];
    }

    // Add user message
    sessions[sessionId].push({ role: 'user', content: message });

    // Keep only last 30 messages
    if (sessions[sessionId].length > 30) {
      sessions[sessionId] = [systemPrompt, ...sessions[sessionId].slice(-29)];
    }

    // Call Groq's API with new model
    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile', // ✅ updated model
        messages: sessions[sessionId],
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const result = response.data.choices[0]?.message?.content?.trim();

    if (result) {
      sessions[sessionId].push({ role: 'assistant', content: result });

      // Check for video suggestion
      const YOUTUBE_REGEX = /https?:\/\/(www\.)?(youtube\.com|youtu\.be)\/\S+/gi;
      const containsVideo = YOUTUBE_REGEX.test(result);

      if (containsVideo) {
        console.log('🎬 SafeHaven suggested a video:', result.match(YOUTUBE_REGEX));
      }

      console.log(`🧠 Assistant: ${result}`);
      return res.json({ response: result });
    } else {
      return res.status(500).json({ error: 'Empty response from assistant.' });
    }

  } catch (error) {
    console.error('Groq API error:', error?.response?.data || error.message);
    return res.status(500).json({
      error: 'Error processing your message',
      details: error?.response?.data || error.message,
    });
  }
};

module.exports = { createchat };
