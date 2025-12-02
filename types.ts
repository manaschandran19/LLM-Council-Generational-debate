export enum PersonaType {
  BOOMER = 'BOOMER',
  MILLENNIAL = 'MILLENNIAL',
  GENZ = 'GENZ',
  MODERATOR = 'MODERATOR'
}

export interface PersonaConfig {
  id: PersonaType;
  name: string;
  avatar: string;
  color: string;
  borderColor: string;
  bgColor: string;
  systemInstruction: string;
  model: string;
}

export interface ChatMessage {
  id: string;
  persona: PersonaType;
  content: string;
  timestamp: number;
}

export interface DebateState {
  topic: string;
  isDebating: boolean;
  messages: ChatMessage[];
  verdict: string | null;
  error: string | null;
}