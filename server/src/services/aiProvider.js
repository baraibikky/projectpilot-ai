import { config } from '../config.js';

/**
 * Clean JSON string output from LLM responses (strips markdown code fences)
 */
function cleanJsonOutput(text) {
  if (!text) return '{}';
  let cleaned = text.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.slice(7);
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.slice(3);
  }
  if (cleaned.endsWith('```')) {
    cleaned = cleaned.slice(0, -3);
  }
  return cleaned.trim();
}

/**
 * Call Google Gemini REST API directly using standard fetch (zero heavy external SDKs)
 */
export async function callGeminiApi({ prompt, systemInstruction = '', apiKey = null, temperature = 0.7, jsonMode = false }) {
  const activeKey = apiKey || config.geminiApiKey;
  if (!activeKey) {
    throw new Error('NO_API_KEY');
  }

  const model = config.aiModel || 'gemini-1.5-flash';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${activeKey}`;

  const contents = [
    {
      role: 'user',
      parts: [{ text: prompt }]
    }
  ];

  const body = {
    contents,
    generationConfig: {
      temperature,
      maxOutputTokens: 3500,
    }
  };

  if (systemInstruction) {
    body.systemInstruction = {
      parts: [{ text: systemInstruction }]
    };
  }

  if (jsonMode) {
    body.generationConfig.responseMimeType = 'application/json';
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 25000);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMsg = errorData.error?.message || `HTTP ${response.status} ${response.statusText}`;
      throw new Error(`Gemini API Error: ${errorMsg}`);
    }

    const data = await response.json();
    const candidate = data.candidates?.[0];
    const text = candidate?.content?.parts?.[0]?.text || '';
    
    if (jsonMode) {
      try {
        return JSON.parse(cleanJsonOutput(text));
      } catch (e) {
        console.warn('Failed to parse Gemini JSON output, returning raw text or fallback', e);
        return { text };
      }
    }

    return { text };
  } catch (err) {
    clearTimeout(timeoutId);
    console.error('Gemini API call failed:', err.message);
    throw err;
  }
}
