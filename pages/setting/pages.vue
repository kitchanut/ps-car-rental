<template>
  <div class="pa-3 pb-0" style="height: 100%">
    <v-card variant="outlined" style="border: 1px solid #ddd">
      <v-card-title class="d-flex">
        <div>Page Facebook</div>
        <v-spacer></v-spacer>
        <v-btn color="primary" variant="tonal" @click="loginWithFacebook">+ page facebook</v-btn>
      </v-card-title>

      <v-divider></v-divider>
      <v-data-table
        :headers="headers"
        :items="data"
        :loading="loading"
        density="compact"
        hide-default-footer
        :items-per-page="-1"
      >
        <template v-slot:item.page_name="{ item }">
          <v-badge :color="item.page_status == 'เปิดใช้งาน' ? 'success' : 'warning'" inline dot></v-badge>
          {{ item.page_name }}
        </template>
      </v-data-table>
    </v-card>
    <v-card v-if="pageLists.length" class="mt-3" variant="outlined" style="border: 1px solid #ddd">
      <v-list v-model:selected="pageSelectId" select-strategy="classic">
        <v-list-subheader>List of Page Facebook:</v-list-subheader>
        <v-list-item v-for="page in pageLists" :value="page.id">
          <template v-slot:prepend="{ isActive }">
            <v-list-item-action start>
              <v-checkbox-btn :model-value="isActive"></v-checkbox-btn>
            </v-list-item-action>
          </template>
          <v-list-item-title>{{ page.name }}</v-list-item-title>
          <!-- <v-list-item-subtitle> Notify me about updates to apps or games that I downloaded </v-list-item-subtitle> -->
        </v-list-item>
      </v-list>
      <v-card-text>
        <div class="text-right">
          <v-btn color="primary" variant="tonal" @click="addPage()" @loading="loading">เพิ่ม</v-btn>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>
<script setup>
import axios from "axios";
const { $toast } = useNuxtApp();
const config = useRuntimeConfig();

const pageLists = ref([]);
const pageSelectId = ref([]);
const pageSelect = computed(() => {
  return pageLists.value.filter((page) => pageSelectId.value.includes(page.id));
});
const loginWithFacebook = () => {
  FB.login(
    function (response) {
      if (response.authResponse) {
        const accessToken = response.authResponse.accessToken;
        getLongLiveToken(accessToken);
        getFageList(accessToken);
      } else {
        $toast.error("ไม่สามารถเชื่อมต่อระบบได้");
        console.error("User cancelled login or did not fully authorize.");
      }
    },
    { scope: "pages_show_list,pages_messaging,pages_read_engagement,pages_manage_metadata" }
  );
};
const longLiveToken = ref("");
const getLongLiveToken = async (accessToken) => {
  const response = await axios({
    method: "GET",
    url: `https://graph.facebook.com/v20.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${config.public.FACEBOOK_APP_ID}&client_secret=${config.public.FACEBOOK_APP_SECRET}&fb_exchange_token=${accessToken}`,
  });
  longLiveToken.value = response.data.access_token;
};

const getFageList = async (accessToken) => {
  const response = await axios({
    method: "GET",
    url: `https://graph.facebook.com/me/accounts?access_token=${accessToken}`,
  });
  console.log("User Info:", response.data);
  pageLists.value = response.data.data;
};

const loading = ref(false);
const addPage = () => {
  console.log(pageSelect.value);
  pageSelect.value.forEach(async (page) => {
    const responseAccessToken = await axios({
      method: "GET",
      url: `https://graph.facebook.com/${page.id}?fields=access_token&access_token=${longLiveToken.value}`,
    });
    let pageInsert = {
      page_id: page.id,
      page_name: page.name,
      page_access_token: responseAccessToken.data.access_token,
    };
    loading.value = true;
    const response = await useApiFacebookPages().store(pageInsert);
    response.status == 201
      ? ($toast.success("ทำรายการสำเร็จ"), (loading.value = false))
      : $toast.error("เกิดข้อผิดพลาด! กรุณาติดต่อผู้แลระบบ"),
      (loading.value = false);
  });
  pageLists.value = [];
  pageSelectId.value = [];
  getData();
};

const headers = ref([{ title: "เพจ", key: "page_name" }]);

const data = ref([]);
const getData = async () => {
  loading.value = true;
  const response = await useApiFacebookPages().index();
  data.value = response.data;
  loading.value = false;
};
getData();
</script>
