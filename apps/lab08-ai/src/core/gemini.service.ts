import type { Base64Image, ImageAnalysisResult } from "./ai.interface";
import { getAI, getGenerativeModel, GoogleAIBackend } from "firebase/ai";
import { app } from "./firebase";

export const ai = getAI(app, { backend: new GoogleAIBackend() });

export const visionModel = getGenerativeModel(ai, {
  model: "gemini-2.0-flash",
});

export class GeminiVisionService {
  static async analyze(image: Base64Image): Promise<ImageAnalysisResult> {
    const prompt = `วิเคราะห์ภาพนี้แล้วตอบกลับเป็น JSON เท่านั้น ห้ามมีข้อความอื่น ห้ามมี markdown
ตอบในรูปแบบนี้เท่านั้น:
{
  "caption": "คำบรรยายภาพ 1 ประโยคภาษาไทย",
  "tags": ["tag1", "tag2", "tag3"],
  "objects": [{"name": "ชื่อวัตถุ"}],
  "safety": {"isSensitive": false}
}`;

    const imagePart = {
      inlineData: { data: image.base64, mimeType: image.mimeType },
    };

    const resp = await visionModel.generateContent([prompt, imagePart]);
    let text = resp.response.text() ?? "{}";
    text = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    
    return JSON.parse(text) as ImageAnalysisResult;
  }
}