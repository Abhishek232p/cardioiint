
import { GoogleGenAI, Type } from "@google/genai";
import { CardioHealthData, AnalysisResult } from "../types";
import { SYSTEM_INSTRUCTION } from "../constants";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  async analyzeHealthData(data: CardioHealthData): Promise<AnalysisResult> {
    const prompt = `
      Analyze the following data:
      Age: ${data.age}
      Gender: ${data.gender}
      Heart Rate: ${data.heartRate} BPM
      Blood Pressure: ${data.systolicBp}/${data.diastolicBp} mmHg
    `;

    try {
      const response = await this.ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              riskLevel: { type: Type.INTEGER, description: '0 for low, 1 for medium, 2 for high' },
              summary: { type: Type.STRING },
              recommendations: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              anomalies: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              }
            },
            required: ["riskLevel", "summary", "recommendations", "anomalies"]
          }
        },
      });

      const result = JSON.parse(response.text || '{}');
      return result as AnalysisResult;
    } catch (error) {
      console.error("Gemini Analysis Error:", error);
      // Fallback basic logic if AI fails
      return {
        riskLevel: 0,
        summary: "Analysis unavailable. Please check connectivity.",
        recommendations: ["Consult a medical professional", "Monitor vitals regularly", "Stay hydrated"],
        anomalies: ["Service connection error"]
      };
    }
  }
}

export const geminiService = new GeminiService();
