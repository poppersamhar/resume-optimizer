const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface DeepSeekResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}

export async function callDeepSeek(
  messages: Message[],
  options: {
    temperature?: number;
    maxTokens?: number;
  } = {}
): Promise<string> {
  const apiKey = process.env.DEEPSEEK_API_KEY;

  if (!apiKey) {
    throw new Error('DEEPSEEK_API_KEY is not configured');
  }

  const response = await fetch(DEEPSEEK_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages,
      temperature: options.temperature ?? 0.7,
      max_tokens: options.maxTokens ?? 4096,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`DeepSeek API error: ${response.status} - ${error}`);
  }

  const data: DeepSeekResponse = await response.json();
  return data.choices[0]?.message?.content ?? '';
}

export function parseJSONResponse<T>(response: string): T {
  // Try to extract JSON from markdown code blocks
  const jsonMatch = response.match(/```(?:json)?\s*([\s\S]*?)```/);
  const jsonStr = jsonMatch ? jsonMatch[1].trim() : response.trim();

  try {
    return JSON.parse(jsonStr);
  } catch {
    // Try to find JSON object or array in the response
    const objectMatch = jsonStr.match(/\{[\s\S]*\}/);
    const arrayMatch = jsonStr.match(/\[[\s\S]*\]/);
    const match = objectMatch || arrayMatch;

    if (match) {
      return JSON.parse(match[0]);
    }
    throw new Error('Failed to parse JSON from response');
  }
}
