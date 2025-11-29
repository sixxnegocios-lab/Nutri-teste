
import { GoogleGenAI, Type } from "@google/genai";
import type { NutritionalInfo } from '../types';

// NOTE: O process.env.API_KEY é injetado pelo ambiente de execução.
// Não é necessário que o usuário o defina manualmente.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = (error) => reject(error);
  });
}

export async function getNutritionalInfo(
  imageFile: File,
  userInfo: { age: number; weight: number; height: number; }
): Promise<NutritionalInfo> {
  const base64Data = await fileToBase64(imageFile);
  const imagePart = {
    inlineData: {
      mimeType: imageFile.type,
      data: base64Data,
    },
  };

  const textPart = {
    text: `
      Analise a imagem deste alimento. Com base nos dados do usuário (Idade: ${userInfo.age}, Peso: ${userInfo.weight}kg, Altura: ${userInfo.height}cm), 
      estime as informações nutricionais.
      Seja o mais preciso possível. Identifique o alimento e forneça os valores para calorias (kcal), 
      proteínas (g), carboidratos (g) e o peso total aproximado em gramas (g).
      Forneça também um breve feedback sobre o alimento.
      Se não conseguir identificar o alimento, forneça uma estimativa genérica para um item semelhante ou indique que a identificação não foi possível em 'feedback'.
    `,
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [imagePart, textPart] },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            foodName: { type: Type.STRING, description: "Nome do alimento identificado." },
            calories: { type: Type.NUMBER, description: "Calorias estimadas em kcal." },
            protein: { type: Type.NUMBER, description: "Proteínas estimadas em gramas." },
            carbohydrates: { type: Type.NUMBER, description: "Carboidratos estimados em gramas." },
            grams: { type: Type.NUMBER, description: "Peso total estimado em gramas." },
            feedback: { type: Type.STRING, description: "Um breve feedback sobre o alimento." },
          },
          required: ["foodName", "calories", "protein", "carbohydrates", "grams", "feedback"],
        }
      },
    });

    const jsonText = response.text.trim();
    const nutritionalData = JSON.parse(jsonText) as NutritionalInfo;
    return nutritionalData;
  } catch (error) {
    console.error("Erro ao chamar a API Gemini:", error);
    throw new Error("Não foi possível analisar a imagem. Tente novamente.");
  }
}
