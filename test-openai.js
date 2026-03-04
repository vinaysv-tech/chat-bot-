require('dotenv').config({ path: '.env.local' });
const { openai } = require('@ai-sdk/openai');
const { generateText } = require('ai');

async function testOpenAI() {
  console.log('Testing OpenAI API...');
  
  // Try to use OpenAI - you'll need to add OPENAI_API_KEY to .env.local
  if (!process.env.OPENAI_API_KEY) {
    console.log('❌ No OpenAI API key found');
    console.log('To use OpenAI, add OPENAI_API_KEY to your .env.local file');
    return;
  }

  try {
    const result = await generateText({
      model: openai('gpt-3.5-turbo'),
      prompt: 'Hello, how are you?',
    });
    console.log('✅ OpenAI Test successful:', result.text);
  } catch (error) {
    console.log('❌ OpenAI Test failed:', error.message);
  }
}

testOpenAI();