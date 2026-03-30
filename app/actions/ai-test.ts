"use server";

import { testGeminiConnection, efficientGenerate } from "@/lib/ai";
import { authorizePermission } from "@/lib/auth";

export async function testGeminiModels() {
  const auth = await authorizePermission("settings.manage");
  if (!auth.allowed) {
    return { error: "Not authorized to perform API tests." };
  }

  const modelCandidates = [
    "gemini-1.5-flash",
    "gemini-1.5-pro",
    "gemini-2.0-flash-exp",
    "gemini-2.0-flash", 
    "gemini-2.5-flash", // Predicted to fail
    "gemini-3.0-flash", // Predicted to fail
  ];

  const results = [];

  for (const model of modelCandidates) {
    try {
      const result = await testGeminiConnection(model);
      results.push(result);
    } catch (e: any) {
      results.push({
        success: false,
        modelUsed: model,
        error: "Execution crash: " + e.message,
      });
    }
  }

  return {
    results,
    summary: `Attempted ${modelCandidates.length} models. Success: ${results.filter(r => r.success).length}`,
  };
}

export async function checkAIEfficiency() {
  const auth = await authorizePermission("settings.manage");
  if (!auth.allowed) return { error: "Not authorized." };

  return await efficientGenerate({
    model: "gemini-2.5-flash",
    systemInstruction: "You are an accountant for a high-performance school. You answer concisely.",
    prompt: "List the 3 most common fee payment methods in a one-word list.",
  });
}
