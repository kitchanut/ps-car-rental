<template>
  <div>
    <v-layout>
      <v-app-bar color="primary">
        <div class="v-container d-flex align-center">
          <v-app-bar-title>
            <v-app-bar-nav-icon v-if="displaySize == 'xs'" @click="drawer = !drawer"></v-app-bar-nav-icon>
            <b class="mr-5 cursor-pointer" @click="$router.push('/')">Car24Rent</b>
            <v-btn v-if="displaySize != 'xs'" size="large" to="/privacy" variant="plain">นโยบายความเป็นส่วนตัว</v-btn>
            <v-btn v-if="displaySize != 'xs'" size="large" to="/contact" variant="plain">ติดต่อเรา</v-btn>
          </v-app-bar-title>
          <v-btn variant="tonal" size="large" to="/login">เข้าสู่ระบบ</v-btn>
        </div>
      </v-app-bar>
      <v-navigation-drawer v-model="drawer" temporary>
        <v-list>
          <v-list-item v-for="item in items" :title="item.title" :to="item.to"></v-list-item>
        </v-list>
      </v-navigation-drawer>
      <v-main>
        <NuxtPage />
      </v-main>
    </v-layout>
  </div>
</template>
<script setup>
import { useDisplay } from "vuetify";
const { name } = useDisplay();
const displaySize = computed(() => name.value);
const drawer = ref(false);
const items = ref([
  {
    title: "หน้าหลัก",
    to: "/",
  },
  {
    title: "นโยบายความเป็นส่วนตัว",
    to: "/privacy",
  },
  {
    title: "ติดต่อเรา",
    to: "/contact",
  },
]);
</script>
