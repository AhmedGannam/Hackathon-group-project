import axios from 'axios';

export const generateAIResponse = async (message) => {
  try {
    // Check if API key is available
    if (!process.env.GEMINI_API_KEY) {
      console.warn('GEMINI_API_KEY not found in environment variables');
      return "I'm currently experiencing technical difficulties. Please try again later.";
    }

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [{
          parts: [{
            text: `You are an expert AI tutor for the Eduverse platform. You help students learn and understand various subjects in a friendly and engaging way. 

User question: ${message}

Please provide a helpful and educational response.`
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 800
        }
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.data.candidates || !response.data.candidates[0].content.parts[0].text) {
      console.error('Invalid response structure from Gemini API:', response.data);
      return "I apologize, but I couldn't generate a proper response. Please try asking your question differently.";
    }

    return response.data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('Gemini API Error:', error.response?.data || error.message);
    
    // Return a user-friendly error message
    if (error.response?.status === 429) {
      return "I'm currently handling too many requests. Please try again in a moment.";
    } else if (error.response?.status === 401 || error.response?.status === 403) {
      return "I'm having trouble accessing my knowledge. Please try again later.";
    }
    
    return "I encountered an error while processing your request. Please try again.";
  }
};