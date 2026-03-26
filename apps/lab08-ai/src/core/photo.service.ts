import type { Base64Image } from "./ai.interface";
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";

export class PhotoService {
  // วิธีที่ 1: เลือกไฟล์จากเครื่อง
  static async fromFile(file: File): Promise<Base64Image> {
    const base64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const res = String(reader.result || "");
        const b64 = res.split(",")[1]; // ตัด "data:image/jpeg;base64," ออก
        if (!b64) return reject(new Error("Invalid base64 data"));
        resolve(b64);
      };
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
    return { base64, mimeType: file.type || "image/jpeg" };
  }

  // วิธีที่ 2: ถ่ายภาพหรือเลือกจากแกลเลอรี (ใช้ Capacitor)
  static async fromCamera(): Promise<Base64Image> {
    const photo = await Camera.getPhoto({
      source: CameraSource.Prompt,    // ถามว่าจะถ่ายหรือเลือกจาก gallery
      resultType: CameraResultType.Base64,
      quality: 85,
    });
    if (!photo.base64String) throw new Error("No base64 from camera");
    return {
      base64: photo.base64String,
      mimeType: photo.format ? `image/${photo.format}` : "image/jpeg"
    };
  }
}