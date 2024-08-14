<template>
  <div>
    <v-layout>
      <v-app-bar color="primary" density="compact">
        <template v-slot:prepend>
          <v-app-bar-nav-icon @click.stop="drawer = !drawer" aria-label="nav-icon"></v-app-bar-nav-icon>
        </template>
        <v-app-bar-title>PS Car Rental</v-app-bar-title>
        <template v-slot:append>
          <v-btn icon="mdi-power-standby" @click="logout()"></v-btn>
        </template>
      </v-app-bar>

      <v-navigation-drawer v-model="drawer" temporary>
        <v-list color="primary">
          <div v-for="item in manu">
            <v-list-item
              v-if="item.to.length == 1"
              :prepend-icon="item.icon"
              :title="item.title"
              :to="item.to[0]"
            ></v-list-item>
            <v-list-group v-else-if="item.to.length > 1" :value="item.value">
              <template v-slot:activator="{ props }">
                <v-list-item v-bind="props" :prepend-icon="item.icon" :title="item.title"></v-list-item>
              </template>
              <v-list-item v-for="sub in item.to" :to="sub.to" :title="sub.title"></v-list-item>
            </v-list-group>
          </div>
        </v-list>
      </v-navigation-drawer>

      <v-main style="max-width: 850px; margin-left: auto; margin-right: auto">
        <NuxtPage />
      </v-main>
    </v-layout>
  </div>
</template>
<script setup>
const drawer = ref(false);
const router = useRouter();
const route = useRoute();

const open = ref([]);
const manu = ref([
  {
    icon: "mdi-chart-areaspline",
    title: "หน้าหลัก",
    to: ["/"],
  },
  {
    icon: "mdi-message-text-outline",
    title: "แชท",
    to: ["/chat"],
  },
  {
    icon: "mdi-calendar-multiselect",
    title: "ปฏิทิน",
    to: ["/calendar"],
  },

  {
    icon: "mdi-notebook",
    title: "การจอง",
    to: ["/booking"],
  },
  {
    icon: "mdi-car-clock",
    title: "รับรถ/คืนรถ",
    to: ["/messengers"],
  },
  {
    icon: "mdi-account-cancel",
    title: "ข้อมูลแบล็กลิสต์",
    to: ["/blacklists"],
  },
  {
    icon: "mdi-file-document-multiple-outline",
    title: "รายงาน",
    value: "report",
    to: [
      { to: "/report/booking", title: "การจอง" },
      { to: "/report/profit", title: "กำไรขาดทุน" },
    ],
  },
  {
    icon: "mdi-cog",
    title: "ตั้งค่า",
    value: "setting",
    to: [
      { to: "/setting/cars", title: "รถ" },
      { to: "/setting/car_types", title: "ประเภทรถ" },
      { to: "/setting/car_brands", title: "ยี่ห้อรถ/รุ่นรถ" },
      { to: "/setting/branch", title: "สาขา" },
      { to: "/setting/customers", title: "ลูกค้า" },
      { to: "/setting/users", title: "ผู้ใช้งาน" },
    ],
  },
]);
const admins = ref([
  ["Management", "mdi-account-multiple-outline"],
  ["Settings", "mdi-cog-outline"],
]);
const cruds = ref([
  ["Create", "mdi-plus-outline"],
  ["Read", "mdi-file-outline"],
  ["Update", "mdi-update"],
  ["Delete", "mdi-delete"],
]);

const logout = () => {
  localStorage.removeItem("token");
  useState("isAuthenticated", () => false);
  router.push({ path: "/login" });
};
</script>
