require('dotenv').config({ path: '.env.local' });
const { google } = require('@ai-sdk/google');
const { generateText } = require('ai');

async function testGoogleAISDK() {
  console.log('Testing Google AI SDK...');
  console.log('API Key present:', !!process.env.GOOGLE_GENERATIVE_AI_API_KEY);
  
  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    console.log('❌ No API key found');
    return;
  }

  try {
    // Try different model formats
    const modelsToTry = [
      'models/gemini-pro',
      'gemini-pro',
      'models/gemini-1.5-pro',
      'gemini-1.5-pro'
    ];

    for (const modelName of modelsToTry) {
      try {
        console.log(`\nTrying model: ${modelName}`);
        const result = await generateText({
          model: google(modelName),
          prompt: 'Hello, test message',
        });
        console.log(`✅ Model ${modelName} works!`);
        console.log('Response:', result.text);
        return;
      } catch (error) {
        console.log(`❌ Model ${modelName} failed:`, error.message);
      }
    }
  } catch (error) {
    console.log('❌ Google AI SDK Test failed:', error.message);
  }
}

testGoogleAISDK();