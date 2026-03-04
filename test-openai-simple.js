require('dotenv').config({ path: '.env.local' });
const { openai } = require('@ai-sdk/openai');
const { generateText } = require('ai');

async function testOpenAI() {
  console.log('Testing OpenAI API...');
  console.log('OpenAI API Key present:', !!process.env.OPENAI_API_KEY);
  
  if (!process.env.OPENAI_API_KEY) {
    console.log('❌ No OpenAI API key found');
    console.log('To use OpenAI, add OPENAI_API_KEY to your .env.local file');
    console.log('You can get an API key from: https://platform.openai.com/api-keys');
    return;
  }

  try {
    const result = await generateText({
      model: openai('gpt-3.5-turbo'),
      prompt: 'Hello, how are you? Please respond with a short greeting.',
    });
    console.log('✅ OpenAI Test successful:', result.text);
  } catch (error) {
    console.log('❌ OpenAI Test failed:', error.message);
  }
}

testOpenAI();