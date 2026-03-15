<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Photo Gallery</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Photo Gallery</ion-title>
        </ion-toolbar>
      </ion-header>

      <!-- ชื่อและรหัสนักศึกษา -->
      <div style="padding: 10px 16px; font-size: 14px; color: #666;">
        โดย นายพรศิลป์ สมบูรณ์เทอดธนา รหัส 653380336-9
      </div>

      <!-- แสดงรูปภาพแบบ Grid -->
      <ion-grid>
        <ion-row>
          <ion-col
            size="6"
            v-for="(photo, position) in photos"
            :key="position"
          >
            <ion-img :src="photo.webviewPath"></ion-img>
          </ion-col>
        </ion-row>
      </ion-grid>

      <!-- ปุ่มถ่ายภาพ (FAB) -->
      <ion-fab vertical="bottom" horizontal="center" slot="fixed">
        <ion-fab-button @click="takePhoto()">
          <ion-icon :icon="camera"></ion-icon>
        </ion-fab-button>
      </ion-fab>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { camera } from 'ionicons/icons';
import {
  IonPage,
  IonHeader,
  IonFab,
  IonFabButton,
  IonIcon,
  IonToolbar,
  IonTitle,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonImg,
} from '@ionic/vue';
import { usePhotoGallery } from '@/composables/usePhotoGallery';

const { photos, takePhoto } = usePhotoGallery();
</script>