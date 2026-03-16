<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>หน้าหลัก</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">

      <div v-if="user" style="text-align:center; margin-top: 30px;">

        <!-- รูปโปรไฟล์ -->
        <img
          v-if="user.photoUrl"
          :src="user.photoUrl"
          style="width:80px; height:80px; border-radius:50%; margin-bottom:16px;"
        />
        <div
          v-else
          style="width:80px; height:80px; border-radius:50%; background:#ddd;
                 display:flex; align-items:center; justify-content:center;
                 margin: 0 auto 16px; font-size:32px;"
        >
          👤
        </div>

        <h2>{{ user.displayName || 'ผู้ใช้งาน' }}</h2>

        <ion-list style="text-align:left; margin-top:20px;">
          <ion-item>
            <ion-label>
              <h3>UID</h3>
              <p>{{ user.uid }}</p>
            </ion-label>
          </ion-item>
          <ion-item>
            <ion-label>
              <h3>Email</h3>
              <p>{{ user.email || '-' }}</p>
            </ion-label>
          </ion-item>
          <ion-item>
            <ion-label>
              <h3>เบอร์โทร</h3>
              <p>{{ user.phoneNumber || '-' }}</p>
            </ion-label>
          </ion-item>
          <ion-item>
            <ion-label>
              <h3>ชื่อ</h3>
              <p>{{ user.displayName || '-' }}</p>
            </ion-label>
          </ion-item>
        </ion-list>

        <ion-button
          expand="block"
          color="danger"
          class="ion-margin-top"
          @click="logout"
        >
          🚪 ออกจากระบบ
        </ion-button>

      </div>

      <div v-else style="text-align:center; margin-top:50px;">
        <p>กำลังโหลดข้อมูล...</p>
      </div>

    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import {
  IonPage, IonHeader, IonToolbar, IonTitle,
  IonContent, IonList, IonItem, IonLabel, IonButton
} from '@ionic/vue';
import { authService } from '@/auth/auth-service';
import type { AuthUser } from '@/auth/auth-interface';
import { useRouter } from 'vue-router';

const router = useRouter();
const user = ref<AuthUser | null>(null);

onMounted(async () => {
  user.value = await authService.getCurrentUser();
});

const logout = async () => {
  await authService.logout();
  router.push('/login');
};
</script>