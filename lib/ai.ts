import { GoogleGenAI } from "@google/genai";

// Initialize the Google Generative AI client
// It will automatically pick up GEMINI_API_KEY from environment variables
export const geminiClient = new GoogleGenAI({});

export async function efficientGenerate(args: {
  model?: string;
  systemInstruction?: string;
  prompt: string;
}) {
  const {
    model = "gemini-2.5-flash",
    systemInstruction = "You are a helpful assistant.",
    prompt
  } = args;

  try {
    const response = await geminiClient.models.generateContent({
      model,
      // @ts-ignore - The SDK might have slightly different names for system instructions
      // but in the unified SDK it's often passed at construction or as part of the content config
      // For now, let's keep it simple to ensure it doesn't crash if the SDK name is slightly different
      system_instruction: systemInstruction,
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        maxOutputTokens: 1024,
        temperature: 0.2, // Lower temperature for more consistent, efficient results
      },
    });

    return {
      success: true,
      text: response.text,
      modelUsed: model,
    };
  } catch (error: any) {
    console.error(`Gemini Efficient Generation Error (${model}):`, error);
    return {
      success: false,
      error: error.message || "Unknown error occurred",
      modelUsed: model,
    };
  }
}

export async function testGeminiConnection(modelName: string = "gemini-2.5-flash") {
  try {
    const response = await geminiClient.models.generateContent({
      model: modelName,
      contents: "Say 'Gemini is active and working!' if you can hear me.",
    });

    return {
      success: true,
      text: response.text,
      modelUsed: modelName
    };
  } catch (error: any) {
    console.error(`Gemini API Error (${modelName}):`, error);
    return {
      success: false,
      error: error.message || "Unknown error occurred",
      modelUsed: modelName
    };
  }
}
