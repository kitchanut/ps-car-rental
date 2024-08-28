<template>
  <div>
    <v-layout>
      <v-app-bar color="primary">
        <div class="v-container d-flex align-center">
          <v-toolbar-title>
            <b class="mr-5 cursor-pointer" @click="$router.push('/')">Car24Rent</b>
            <v-btn size="large" to="/privacy" variant="plain">นโยบายความเป็นส่วนตัว</v-btn>
            <v-btn size="large" to="/contact" variant="plain">ติดต่อเรา</v-btn>
          </v-toolbar-title>
          <v-btn variant="tonal" size="large" to="/login">เข้าสู่ระบบ</v-btn>
        </div>
      </v-app-bar>
      <v-main>
        <NuxtPage />
      </v-main>
    </v-layout>
  </div>
</template>
<script setup></script>
