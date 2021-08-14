type CodexConfig = {
  engine: string;
  temperature: number;
  maxTokens: number;
  topP: number;
  frequencyPenalty: number;
  presencePenalty: number;
  apiKey: string | null;
};