require('dotenv').config({ path: '.env.local' });
const { google } = require('@ai-sdk/google');

async function listModels() {
  console.log('Testing Google API...');
  console.log('API Key present:', !!process.env.GOOGLE_GENERATIVE_AI_API_KEY);
  
  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    console.log('❌ No API key found');
    return;
  }

  try {
    // Try different model names that might work
    const modelsToTry = [
      'gemini-pro',
      'gemini-1.5-pro',
      'gemini-1.5-flash',
      'gemini-1.0-pro',
      'models/gemini-pro',
      'models/gemini-1.5-pro',
      'models/gemini-1.5-flash'
    ];

    for (const modelName of modelsToTry) {
      try {
        console.log(`\nTrying model: ${modelName}`);
        const { generateText } = require('ai');
        const result = await generateText({
          model: google(modelName),
          prompt: 'Hello, test',
        });
        console.log(`✅ Model ${modelName} works!`);
        console.log('Response:', result.text);
        return;
      } catch (error) {
        console.log(`❌ Model ${modelName} failed:`, error.message);
      }
    }
  } catch (error) {
    console.log('❌ API Test failed:', error.message);
  }
}

listModels();