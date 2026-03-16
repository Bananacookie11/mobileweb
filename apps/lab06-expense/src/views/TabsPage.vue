<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar slot="bottom">

        <ion-tab-button tab="list" href="/tabs/list">
          <ion-icon :icon="list" />
          <ion-label>รายการ</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="add" href="/tabs/add">
          <ion-icon :icon="addCircle" />
          <ion-label>เพิ่มรายการ</ion-label>
        </ion-tab-button>

      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonTabBar, IonTabButton, IonTabs,
  IonLabel, IonIcon, IonPage, IonRouterOutlet
} from '@ionic/vue';
import { list, addCircle } from 'ionicons/icons';
</script>