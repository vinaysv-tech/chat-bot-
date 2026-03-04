require('dotenv').config({ path: '.env.local' });
const { google } = require('@ai-sdk/google');
const { generateText } = require('ai');

async function testAPI() {
  console.log('Testing Google API...');
  console.log('API Key present:', !!process.env.GOOGLE_GENERATIVE_AI_API_KEY);
  
  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    console.log('❌ No API key found');
    return;
  }
  
  try {
    const result = await generateText({
    model: google('gemini-pro'),
    prompt: 'Hello, how are you?',
  });
    console.log('✅ API Test successful:', result.text);
  } catch (error) {
    console.log('❌ API Test failed:', error.message);
  }
}

testAPI();