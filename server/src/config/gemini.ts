import { GoogleGenAI } from '@google/genai';
import { env } from './env.js';

export const isGeminiConfigured = Boolean(env.GEMINI_API_KEY && env.GEMINI_API_KEY.trim() !== '');

if (!isGeminiConfigured) {
  console.warn('⚠️ WARNING: GEMINI_API_KEY is not set. KisanSeva will utilize localized deterministic Agronomic AI fallback models.');
}

export const ai = isGeminiConfigured
  ? new GoogleGenAI({ apiKey: env.GEMINI_API_KEY! })
  : null;

export const AGRI_MODEL = 'gemini-2.5-flash';
