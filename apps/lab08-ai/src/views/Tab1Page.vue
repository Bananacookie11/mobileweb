<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Lab08: Gemini Vision</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <!-- input file ซ่อนไว้ -->
      <input ref="fileEl" type="file" accept="image/*" hidden @change="onFileChange" />

      <!-- ปุ่มเลือกไฟล์ -->
      <ion-button expand="block" @click="fileEl?.click()">
        📁 เลือกไฟล์ภาพ
      </ion-button>

      <!-- ปุ่มถ่ายภาพ -->
      <ion-button expand="block" color="secondary" @click="onTakePhoto">
        📷 ถ่ายภาพ (Camera)
      </ion-button>

      <!-- แสดง preview ภาพ -->
      <ion-img v-if="previewUrl" :src="previewUrl" style="margin: 16px 0;" />

      <!-- ปุ่มวิเคราะห์ -->
      <ion-button
        expand="block"
        color="success"
        :disabled="!img || loading"
        @click="onAnalyze"
      >
        🔍 วิเคราะห์ภาพ
      </ion-button>

      <!-- loading spinner -->
      <div v-if="loading" style="text-align:center; margin:16px">
        <ion-spinner />
        <p>กำลังวิเคราะห์...</p>
      </div>

      <!-- แสดงผลลัพธ์ -->
      <div v-if="result" style="margin-top: 16px;">
        <ion-card>
          <ion-card-header>
            <ion-card-title>📝 คำบรรยาย</ion-card-title>
          </ion-card-header>
          <ion-card-content>{{ result.caption }}</ion-card-content>
        </ion-card>

        <ion-card>
          <ion-card-header>
            <ion-card-title>🏷️ Tags</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <ion-chip v-for="tag in result.tags" :key="tag">{{ tag }}</ion-chip>
          </ion-card-content>
        </ion-card>

        <ion-card v-if="result.objects?.length">
          <ion-card-header>
            <ion-card-title>📦 วัตถุที่พบ</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <ion-item v-for="obj in result.objects" :key="obj.name">
              <ion-label>
                {{ obj.name }}
                <span v-if="obj.confidence">
                  ({{ Math.round(obj.confidence * 100) }}%)
                </span>
              </ion-label>
            </ion-item>
          </ion-card-content>
        </ion-card>

        <ion-card v-if="result.safety">
          <ion-card-header>
            <ion-card-title>🛡️ Safety</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <p>อ่อนไหว: {{ result.safety.isSensitive ? '⚠️ ใช่' : '✅ ไม่' }}</p>
            <p v-if="result.safety.notes">{{ result.safety.notes }}</p>
          </ion-card-content>
        </ion-card>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from "vue";
import {
  IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle,
  IonChip, IonContent, IonHeader, IonImg, IonItem, IonLabel,
  IonPage, IonSpinner, IonTitle, IonToolbar
} from "@ionic/vue";
import { PhotoService } from "../core/photo.service";
import { GeminiVisionService } from "../core/gemini.service";
import type { Base64Image, ImageAnalysisResult } from "../core/ai.interface";

const fileEl = ref<HTMLInputElement | null>(null);
const img = ref<Base64Image | null>(null);
const previewUrl = ref("");
const result = ref<ImageAnalysisResult | null>(null);
const loading = ref(false);

async function onFileChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file) return;
  img.value = await PhotoService.fromFile(file);
  previewUrl.value = URL.createObjectURL(file);
  result.value = null;
}

async function onTakePhoto() {
  loading.value = true;
  try {
    const b64 = await PhotoService.fromCamera();
    img.value = b64;
    previewUrl.value = `data:${b64.mimeType};base64,${b64.base64}`;
    result.value = null;
  } finally {
    loading.value = false;
  }
}

async function onAnalyze() {
  if (!img.value) return;
  loading.value = true;
  try {
    result.value = await GeminiVisionService.analyze(img.value);
  } finally {
    loading.value = false;
  }
}
</script>