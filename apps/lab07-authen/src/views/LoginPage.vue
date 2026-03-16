<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>เข้าสู่ระบบ</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">

      <!-- โลโก้ -->
      <div style="text-align:center; margin: 30px 0;">
        <h2>🔐 Lab07 Auth</h2>
        <p style="color:#666">นายพรศิลป์ สมบูรณ์เทอดธนา 653380336-9</p>
      </div>

      <!-- แสดง error -->
      <ion-text color="danger" v-if="errorMsg">
        <p style="text-align:center">{{ errorMsg }}</p>
      </ion-text>

      <!-- ===== Email/Password ===== -->
      <ion-card>
        <ion-card-header>
          <ion-card-title>📧 Login ด้วย Email</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <ion-item>
            <ion-label position="stacked">Email</ion-label>
            <ion-input
              type="email"
              v-model="email"
              placeholder="example@email.com"
            ></ion-input>
          </ion-item>
          <ion-item>
            <ion-label position="stacked">Password</ion-label>
            <ion-input
              type="password"
              v-model="password"
              placeholder="รหัสผ่าน"
            ></ion-input>
          </ion-item>
          <ion-button
            expand="block"
            class="ion-margin-top"
            @click="loginEmail"
            :disabled="loading"
          >
            เข้าสู่ระบบ
          </ion-button>
          <ion-button
            expand="block"
            fill="outline"
            @click="registerEmail"
            :disabled="loading"
          >
            สมัครสมาชิก
          </ion-button>
        </ion-card-content>
      </ion-card>

      <!-- ===== Google ===== -->
      <ion-card>
        <ion-card-content>
          <ion-button
            expand="block"
            color="danger"
            @click="loginGoogle"
            :disabled="loading"
          >
            🔴 Login ด้วย Google
          </ion-button>
        </ion-card-content>
      </ion-card>

      <!-- ===== Phone ===== -->
      <ion-card>
        <ion-card-header>
          <ion-card-title>📱 Login ด้วยเบอร์โทร</ion-card-title>
        </ion-card-header>
        <ion-card-content>

          <!-- ถ้ายังไม่ได้ส่ง OTP -->
          <div v-if="!verificationId">
            <ion-item>
              <ion-label position="stacked">เบอร์โทร (E.164)</ion-label>
              <ion-input
                v-model="phoneNumber"
                placeholder="+66812345678"
              ></ion-input>
            </ion-item>
            <!-- reCAPTCHA container -->
            <div id="recaptcha-container"></div>
            <ion-button
              expand="block"
              color="tertiary"
              class="ion-margin-top"
              @click="sendOTP"
              :disabled="loading"
            >
              ส่ง OTP
            </ion-button>
          </div>

          <!-- หลังส่ง OTP แล้ว -->
          <div v-else>
            <ion-item>
              <ion-label position="stacked">กรอก OTP</ion-label>
              <ion-input
                v-model="otpCode"
                placeholder="รหัส OTP 6 หลัก"
                type="number"
              ></ion-input>
            </ion-item>
            <ion-button
              expand="block"
              color="tertiary"
              class="ion-margin-top"
              @click="confirmOTP"
              :disabled="loading"
            >
              ยืนยัน OTP
            </ion-button>
            <ion-button
              expand="block"
              fill="outline"
              @click="verificationId = ''"
            >
              ส่ง OTP ใหม่
            </ion-button>
          </div>

        </ion-card-content>
      </ion-card>

      <ion-loading :is-open="loading" message="กำลังเข้าสู่ระบบ..."></ion-loading>

    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonCard, IonCardHeader, IonCardTitle, IonCardContent,
  IonItem, IonLabel, IonInput, IonButton, IonText, IonLoading
} from '@ionic/vue';
import { authService } from '@/auth/auth-service';
import { firebaseAuth } from '@/auth/auth-web';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'vue-router';

const router = useRouter();
const email = ref('');
const password = ref('');
const phoneNumber = ref('');
const otpCode = ref('');
const verificationId = ref('');
const loading = ref(false);
const errorMsg = ref('');

// Login Email
const loginEmail = async () => {
  loading.value = true;
  errorMsg.value = '';
  try {
    await authService.loginWithEmailPassword({
      email: email.value,
      password: password.value,
    });
    router.push('/tabs/tab1');
  } catch (e: any) {
    errorMsg.value = e.message || 'Login ไม่สำเร็จ';
  } finally {
    loading.value = false;
  }
};

// Register Email
const registerEmail = async () => {
  loading.value = true;
  errorMsg.value = '';
  try {
    await createUserWithEmailAndPassword(
      firebaseAuth,
      email.value,
      password.value
    );
    router.push('/tabs/tab1');
  } catch (e: any) {
    errorMsg.value = e.message || 'สมัครสมาชิกไม่สำเร็จ';
  } finally {
    loading.value = false;
  }
};

// Login Google
const loginGoogle = async () => {
  loading.value = true;
  errorMsg.value = '';
  try {
    await authService.loginWithGoogle();
    router.push('/tabs/tab1');
  } catch (e: any) {
    errorMsg.value = e.message || 'Google Login ไม่สำเร็จ';
  } finally {
    loading.value = false;
  }
};

// ส่ง OTP
const sendOTP = async () => {
  loading.value = true;
  errorMsg.value = '';
  try {
    const result = await authService.startPhoneLogin({
      phoneNumberE164: phoneNumber.value,
    });
    verificationId.value = result.verificationId;
  } catch (e: any) {
    errorMsg.value = e.message || 'ส่ง OTP ไม่สำเร็จ';
  } finally {
    loading.value = false;
  }
};

// ยืนยัน OTP
const confirmOTP = async () => {
  loading.value = true;
  errorMsg.value = '';
  try {
    await authService.confirmPhoneCode({
      verificationId: verificationId.value,
      verificationCode: otpCode.value,
    });
    router.push('/tabs/tab1');
  } catch (e: any) {
    errorMsg.value = e.message || 'OTP ไม่ถูกต้อง';
  } finally {
    loading.value = false;
  }
};
</script>