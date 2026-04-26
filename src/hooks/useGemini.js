import { useState } from 'react';
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true,
});

export function useGemini() {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);

  const askGemini = async (prompt, systemContext = '') => {
    setLoading(true);
    setResponse(null);
    try {
      const messages = [];

      if (systemContext) {
        messages.push({ role: 'system', content: systemContext });
      }

      messages.push({ role: 'user', content: prompt });

      const completion = await groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages,
        temperature: 0.7,
        max_tokens: 1024,
      });

      const text = completion.choices[0]?.message?.content ?? '';
      setResponse(text);
      return text;
    } catch (error) {
      console.error('Groq Error:', error);
      const errMsg = 'I apologize, but I encountered an error. Please try again.';
      setResponse(errMsg);
      return errMsg;
    } finally {
      setLoading(false);
    }
  };

  return { askGemini, response, loading };
}
