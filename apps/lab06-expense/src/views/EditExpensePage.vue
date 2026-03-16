<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/tabs/list"></ion-back-button>
        </ion-buttons>
        <ion-title>แก้ไขรายการ</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">

      <ion-item>
        <ion-label position="stacked">ชื่อรายการ</ion-label>
        <ion-input v-model="title"></ion-input>
      </ion-item>

      <ion-item>
        <ion-label position="stacked">จำนวนเงิน (บาท)</ion-label>
        <ion-input type="number" v-model="amount"></ion-input>
      </ion-item>

      <ion-item>
        <ion-label position="stacked">ประเภท</ion-label>
        <ion-select v-model="type">
          <ion-select-option value="income">💰 รายรับ</ion-select-option>
          <ion-select-option value="expense">💸 รายจ่าย</ion-select-option>
        </ion-select>
      </ion-item>

      <ion-item>
        <ion-label position="stacked">หมวดหมู่</ion-label>
        <ion-select v-model="category">
          <ion-select-option value="food">🍔 อาหาร</ion-select-option>
          <ion-select-option value="transport">🚗 การเดินทาง</ion-select-option>
          <ion-select-option value="shopping">🛍️ ช้อปปิ้ง</ion-select-option>
          <ion-select-option value="salary">💼 เงินเดือน</ion-select-option>
          <ion-select-option value="other">📦 อื่นๆ</ion-select-option>
        </ion-select>
      </ion-item>

      <ion-item>
        <ion-label position="stacked">หมายเหตุ</ion-label>
        <ion-textarea v-model="note"></ion-textarea>
      </ion-item>

      <!-- ปุ่มบันทึก -->
      <ion-button expand="block" class="ion-margin-top" @click="updateExpense">
        ✏️ บันทึกการแก้ไข
      </ion-button>

      <!-- ปุ่มลบ -->
      <ion-button
        expand="block"
        color="danger"
        class="ion-margin-top"
        @click="confirmDelete"
      >
        🗑️ ลบรายการนี้
      </ion-button>

    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonButtons,
  IonBackButton, IonContent, IonItem, IonLabel, IonInput,
  IonSelect, IonSelectOption, IonTextarea, IonButton,
  alertController
} from '@ionic/vue';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/firebase';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const id = route.params.id as string;

const title = ref('');
const amount = ref(0);
const type = ref('expense');
const category = ref('food');
const note = ref('');

// โหลดข้อมูลเดิม
onMounted(async () => {
  const docRef = doc(db, 'expenses', id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const data = docSnap.data();
    title.value = data.title;
    amount.value = data.amount;
    type.value = data.type;
    category.value = data.category;
    note.value = data.note;
  }
});

// อัปเดตข้อมูล
const updateExpense = async () => {
  await updateDoc(doc(db, 'expenses', id), {
    title: title.value,
    amount: Number(amount.value),
    type: type.value,
    category: category.value,
    note: note.value
  });
  router.push('/tabs/list');
};

// ยืนยันก่อนลบ
const confirmDelete = async () => {
  const alert = await alertController.create({
    header: 'ยืนยันการลบ',
    message: `ต้องการลบ "${title.value}" ใช่หรือไม่?`,
    buttons: [
      {
        text: 'ยกเลิก',
        role: 'cancel'
      },
      {
        text: 'ลบ',
        role: 'destructive',
        handler: async () => {
          await deleteDoc(doc(db, 'expenses', id));
          router.push('/tabs/list');
        }
      }
    ]
  });
  await alert.present();
};
</script>