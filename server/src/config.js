import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  geminiApiKey: process.env.GEMINI_API_KEY || process.env.AI_API_KEY || '',
  aiProvider: process.env.AI_PROVIDER || 'auto',
  aiModel: process.env.AI_MODEL || 'gemini-1.5-flash',
  isProduction: process.env.NODE_ENV === 'production'
};
