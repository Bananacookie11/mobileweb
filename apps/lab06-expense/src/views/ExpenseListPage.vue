<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>รายรับ - รายจ่าย</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>

      <!-- สรุปยอด -->
      <div class="summary">
        <div class="summary-box income">
          <p>รายรับ</p>
          <h3>{{ totalIncome.toLocaleString() }} ฿</h3>
        </div>
        <div class="summary-box expense">
          <p>รายจ่าย</p>
          <h3>{{ totalExpense.toLocaleString() }} ฿</h3>
        </div>
        <div class="summary-box balance">
          <p>คงเหลือ</p>
          <h3>{{ (totalIncome - totalExpense).toLocaleString() }} ฿</h3>
        </div>
      </div>

      <!-- รายการ -->
      <ion-list>
        <ion-item
          v-for="expense in expenses"
          :key="expense.id"
          button
          @click="goToEdit(expense.id)"
        >
          <ion-label>
            <h2>{{ expense.title }}</h2>
            <p>{{ expense.category }} | {{ expense.note }}</p>
            <p>{{ formatDate(expense.createdAt) }}</p>
          </ion-label>
          <ion-badge
            slot="end"
            :color="expense.type === 'income' ? 'success' : 'danger'"
          >
            {{ expense.type === 'income' ? '+' : '-' }}
            {{ expense.amount.toLocaleString() }} ฿
          </ion-badge>
        </ion-item>
      </ion-list>

      <ion-text v-if="expenses.length === 0" class="ion-text-center ion-padding">
        <p>ยังไม่มีรายการ กดปุ่ม "เพิ่มรายการ" เพื่อเริ่มต้น</p>
      </ion-text>

    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import {
  IonPage, IonHeader, IonToolbar, IonTitle,
  IonContent, IonList, IonItem, IonLabel,
  IonBadge, IonText
} from '@ionic/vue';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '@/firebase';
import { useRouter } from 'vue-router';

const router = useRouter();
const expenses = ref<any[]>([]);
let unsubscribe: any = null;

onMounted(() => {
  const q = query(collection(db, 'expenses'), orderBy('createdAt', 'desc'));
  unsubscribe = onSnapshot(q, (snapshot) => {
    expenses.value = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  });
});

onUnmounted(() => {
  if (unsubscribe) unsubscribe();
});

const totalIncome = computed(() =>
  expenses.value
    .filter(e => e.type === 'income')
    .reduce((sum, e) => sum + e.amount, 0)
);

const totalExpense = computed(() =>
  expenses.value
    .filter(e => e.type === 'expense')
    .reduce((sum, e) => sum + e.amount, 0)
);

const goToEdit = (id: string) => {
  router.push(`/tabs/edit/${id}`);
};

const formatDate = (date: any) => {
  if (!date) return '';
  const d = date.toDate ? date.toDate() : new Date(date);
  return d.toLocaleDateString('th-TH');
};
</script>

<style scoped>
.summary {
  display: flex;
  justify-content: space-around;
  padding: 16px;
  background: #f5f5f5;
}
.summary-box {
  text-align: center;
  padding: 10px;
  border-radius: 8px;
  min-width: 90px;
}
.summary-box p { margin: 0; font-size: 12px; }
.summary-box h3 { margin: 4px 0 0; font-size: 16px; font-weight: bold; }
.income { background: #e8f5e9; color: #2e7d32; }
.expense { background: #ffebee; color: #c62828; }
.balance { background: #e3f2fd; color: #1565c0; }
</style>