import { GoogleGenAI, Type } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: apiKey || '' });

export interface DesignIdea {
  title: string;
  description: string;
  difficulty: "Easy" | "Medium" | "Hard";
}

export async function generateDesignIdeas(material: string, size: number): Promise<DesignIdea[]> {
  if (!apiKey) return [];

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Suggest 3 creative projects that can be made with small fabric scraps. 
      Material: ${material}
      Size: ${size} meters.
      Focus on simple crafts like masks, pouches, or doll clothes.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              difficulty: { type: Type.STRING, enum: ["Easy", "Medium", "Hard"] }
            },
            required: ["title", "description", "difficulty"]
          }
        }
      }
    });

    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error("Gemini Error:", error);
    return [
      { title: "Patchwork Face Mask", description: "Use multiple small scraps to create a stylish face mask.", difficulty: "Easy" },
      { title: "Fabric Keyring", description: "Create a small stuffed charm for your keys.", difficulty: "Easy" }
    ];
  }
}
