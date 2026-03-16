<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>เพิ่มรายการ</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">

      <ion-item>
        <ion-label position="stacked">ชื่อรายการ</ion-label>
        <ion-input v-model="title" placeholder="เช่น ค่าอาหาร"></ion-input>
      </ion-item>

      <ion-item>
        <ion-label position="stacked">จำนวนเงิน (บาท)</ion-label>
        <ion-input type="number" v-model="amount" placeholder="0"></ion-input>
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
        <ion-textarea v-model="note" placeholder="รายละเอียดเพิ่มเติม"></ion-textarea>
      </ion-item>

      <ion-button
        expand="block"
        class="ion-margin-top"
        @click="saveExpense"
        :disabled="!title || !amount"
      >
        💾 บันทึกข้อมูล
      </ion-button>

    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import {
  IonPage, IonHeader, IonToolbar, IonTitle,
  IonContent, IonItem, IonLabel, IonInput,
  IonSelect, IonSelectOption, IonTextarea, IonButton
} from '@ionic/vue';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/firebase';
import { useRouter } from 'vue-router';

const router = useRouter();
const title = ref('');
const amount = ref(0);
const type = ref('expense');
const category = ref('food');
const note = ref('');

const saveExpense = async () => {
  await addDoc(collection(db, 'expenses'), {
    title: title.value,
    amount: Number(amount.value),
    type: type.value,
    category: category.value,
    note: note.value,
    createdAt: new Date()
  });

  // reset form
  title.value = '';
  amount.value = 0;
  type.value = 'expense';
  category.value = 'food';
  note.value = '';

  router.push('/tabs/list');
};
</script>