require('dotenv').config({ path: '.env.local' });
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function listAvailableModels() {
  console.log('Listing available Google AI models...');
  console.log('API Key present:', !!process.env.GOOGLE_GENERATIVE_AI_API_KEY);
  
  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    console.log('❌ No API key found');
    return;
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY);
    
    // Try to make a simple request to see available models
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models?key=' + process.env.GOOGLE_GENERATIVE_AI_API_KEY);
    const data = await response.json();
    
    console.log('Available models:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.log('❌ Failed to list models:', error.message);
  }
}

listAvailableModels();