import { GoogleGenAI, HarmCategory, HarmBlockThreshold } from "@google/genai";
import { PERSONAS, MODERATOR_CONFIG } from '../constants';
import { PersonaType } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SAFETY_SETTINGS = [
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
  { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
];

export const generatePersonaResponse = async (personaId: PersonaType, topic: string): Promise<string> => {
  if (personaId === PersonaType.MODERATOR) throw new Error("Use generateModeratorVerdict for moderator");

  const persona = PERSONAS[personaId as Exclude<PersonaType, PersonaType.MODERATOR>];

  try {
    const response = await ai.models.generateContent({
      model: persona.model,
      contents: {
        role: 'user',
        parts: [{ text: `The debate topic is: "${topic}". Share your opinion now!` }]
      },
      config: {
        systemInstruction: { parts: [{ text: persona.systemInstruction }] },
        temperature: 0.9, 
        maxOutputTokens: 500, // Increased from 200
        // CRITICAL FIX: Set thinkingBudget to 0 for Gemini 2.5 to prevent it from consuming all tokens
        // on "thinking" and returning an empty text response.
        thinkingConfig: { thinkingBudget: 0 }, 
        safetySettings: SAFETY_SETTINGS,
      }
    });
    
    if (!response.text) {
      console.warn(`Empty response for ${persona.name}. Candidate:`, response.candidates?.[0]);
      return `*${persona.name} refuses to comment (Safety Filter or Token Limit)*`;
    }

    return response.text;
  } catch (error: any) {
    console.error(`Error generating response for ${persona.name}:`, error);
    return `(Error: ${error.message || "Connection failed"})`;
  }
};

export const generateModeratorVerdict = async (
  topic: string,
  responses: { persona: PersonaType; content: string }[]
): Promise<string> => {
  try {
    const debateTranscript = responses.map(r => {
      const name = r.persona === PersonaType.BOOMER ? "Boomer Uncle" : r.persona === PersonaType.MILLENNIAL ? "Millennial" : "Gen Z";
      return `${name}: ${r.content}`;
    }).join('\n\n');

    const prompt = `
    The Topic was: "${topic}"

    Here is the debate transcript:
    ${debateTranscript}

    Who won this round of the GenWar Council?
    `;

    const response = await ai.models.generateContent({
      model: MODERATOR_CONFIG.model,
      contents: {
        role: 'user',
        parts: [{ text: prompt }]
      },
      config: {
        systemInstruction: { parts: [{ text: MODERATOR_CONFIG.systemInstruction }] },
        temperature: 0.7,
        maxOutputTokens: 1024, // Increased significantly from 300 to allow for detailed verdicts
        safetySettings: SAFETY_SETTINGS,
      }
    });

    if (!response.text) {
        return "The Moderator is silent today (Safety Filter Triggered).";
    }

    return response.text;
  } catch (error: any) {
    console.error("Error generating verdict:", error);
    return `The Moderator has left the chat. (Error: ${error.message})`;
  }
};