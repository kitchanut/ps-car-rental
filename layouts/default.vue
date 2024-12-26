<template>
  <div>
    <v-layout>
      <v-app-bar color="primary" density="compact">
        <div class="v-container d-flex align-center" style="max-width: 870px !important">
          <v-app-bar-nav-icon
            v-if="displaySize == 'xs' || displaySize == 'sm'"
            @click.stop="drawer = !drawer"
            aria-label="nav-icon"
          ></v-app-bar-nav-icon>
          <v-app-bar-title>
            PSCarRental <span v-if="user.branches">: {{ user.branches.branch_name }}</span>
          </v-app-bar-title>

          <v-btn icon="mdi-power-standby" @click="logout()"></v-btn>
        </div>
      </v-app-bar>

      <v-navigation-drawer v-model="drawer" temporary>
        <v-list color="primary">
          <div v-for="item in manu">
            <v-list-item
              v-if="item.to.length == 1 && item.level.includes(user.level)"
              :prepend-icon="item.icon"
              :title="item.title"
              :to="item.to[0]"
            ></v-list-item>
            <v-list-group v-else-if="item.to.length > 1 && item.level.includes(user.level)" :value="item.value">
              <template v-slot:activator="{ props }">
                <v-list-item v-bind="props" :prepend-icon="item.icon" :title="item.title"></v-list-item>
              </template>
              <v-list-item v-for="sub in item.to" :to="sub.to" :title="sub.title"></v-list-item>
            </v-list-group>
          </div>
        </v-list>
      </v-navigation-drawer>

      <v-main
        v-if="displaySize == 'xs' || displaySize == 'sm'"
        style="max-width: 850px; margin-left: auto; margin-right: auto"
      >
        <NuxtPage />
      </v-main>
      <v-main v-else style="max-width: 850px; margin-left: auto; margin-right: auto">
        <v-row no-gutters>
          <v-col cols="3" style="flex: 0 0 23%">
            <v-card
              class="mt-3 border overflow-auto"
              variant="outlined"
              style="position: fixed; width: 197px; height: 90vh"
            >
              <v-list color="primary">
                <div v-for="item in manu">
                  <v-list-item
                    v-if="item.to.length == 1 && item.level.includes(user.level)"
                    :prepend-icon="item.icon"
                    :title="item.title"
                    :to="item.to[0]"
                  ></v-list-item>
                  <v-list-group v-else-if="item.to.length > 1 && item.level.includes(user.level)" :value="item.value">
                    <template v-slot:activator="{ props }">
                      <v-list-item v-bind="props" :prepend-icon="item.icon" :title="item.title"></v-list-item>
                    </template>
                    <v-list-item v-for="sub in item.to" :to="sub.to" :title="sub.title"></v-list-item>
                  </v-list-group>
                </div>
              </v-list>
            </v-card>
          </v-col>
          <v-col>
            <NuxtPage />
          </v-col>
        </v-row>
      </v-main>
    </v-layout>
  </div>
</template>
<script setup>
import { useDisplay } from "vuetify";
const { name } = useDisplay();
const displaySize = computed(() => name.value);
const user = ref(localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null);

const drawer = ref(false);
const router = useRouter();

const manu = ref([
  {
    icon: "mdi-chart-areaspline",
    title: "หน้าหลัก",
    to: ["/dashboard"],
    level: ["แอดมิน", "ผู้บริหาร", "ผู้ใช้งานทั่วไป"],
  },
  {
    icon: "mdi-message-text-outline",
    title: "แชท",
    to: ["/chat"],
    level: ["แอดมิน", "ผู้บริหาร", "ผู้ใช้งานทั่วไป"],
  },
  {
    icon: "mdi-calendar-multiselect",
    title: "ปฏิทิน",
    to: ["/calendar"],
    level: ["แอดมิน", "ผู้บริหาร", "ผู้ใช้งานทั่วไป"],
  },

  {
    icon: "mdi-notebook",
    title: "การจอง",
    to: ["/bookings"],
    level: ["แอดมิน", "ผู้บริหาร", "ผู้ใช้งานทั่วไป"],
  },
  {
    icon: "mdi-car-arrow-right",
    title: "รับรถ",
    to: ["/pickups"],
    level: ["แอดมิน", "ผู้บริหาร", "ผู้ใช้งานทั่วไป"],
  },
  {
    icon: "mdi-car-arrow-left",
    title: "คืนรถ",
    to: ["/returns"],
    level: ["แอดมิน", "ผู้บริหาร", "ผู้ใช้งานทั่วไป"],
  },
  {
    icon: "mdi-account",
    title: "ลูกค้า",
    to: ["/customers"],
    level: ["แอดมิน", "ผู้บริหาร", "ผู้ใช้งานทั่วไป"],
  },
  {
    icon: "mdi-wallet",
    title: "บัญชี",
    to: ["/accounts"],
    level: ["แอดมิน", "ผู้บริหาร"],
  },
  {
    icon: "mdi-car",
    title: "รถ",
    to: ["/cars"],
    level: ["แอดมิน", "ผู้บริหาร"],
  },
  {
    icon: "mdi-file-document-multiple-outline",
    title: "รายงาน",
    value: "report",
    to: [
      { to: "/report/booking", title: "การจอง" },
      { to: "/report/profit", title: "กำไรขาดทุน" },
    ],
    level: ["แอดมิน", "ผู้บริหาร"],
  },
  {
    icon: "mdi-cog",
    title: "ตั้งค่า",
    value: "setting",
    to: [
      { to: "/setting/car_types", title: "ประเภทรถ" },
      { to: "/setting/car_brands", title: "ยี่ห้อรถ/รุ่นรถ" },
      { to: "/setting/branches", title: "สาขา" },
      { to: "/setting/pages", title: "เพจ" },
      { to: "/setting/users", title: "ผู้ใช้งาน" },
    ],
    level: ["แอดมิน", "ผู้บริหาร"],
  },
]);

const logout = () => {
  useCookie("user").value = null;
  useCookie("token").value = null;
  useCookie("isLogin").value = false;

  router.push({ path: "/login" });
};
</script>
