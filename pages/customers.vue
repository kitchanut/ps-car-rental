<template>
  <div class="pa-3">
    <v-card variant="outlined" style="border: 1px solid #ddd">
      <div class="d-flex ma-3">
        <DialogCustomer appearance="add" actionType="add" @success="getData()" />
        <v-text-field
          class="pl-3"
          v-model="search"
          append-inner-icon="mdi-magnify"
          label="ค้นหา"
          single-line
          hide-details
          density="compact"
        ></v-text-field>
      </div>

      <v-divider></v-divider>
      <v-data-table
        :headers="headers"
        :items="data"
        :loading="loading"
        :search="search"
        density="compact"
        hide-default-footer
        :items-per-page="-1"
        @click:row="handleClick"
      >
        <template v-slot:item.customer_name="{ item }">
          <v-badge :color="item.customer_status == 'เปิดใช้งาน' ? 'success' : 'warning'" inline dot></v-badge>
          {{ item.customer_name }}
        </template>
      </v-data-table>
    </v-card>

    <DialogCustomer :dialog="dialog" :id="id" actionType="edit" @success="getData()" @close="dialog = false" />
  </div>
</template>
<script setup>
const { $toast } = useNuxtApp();
const search = ref("");
const loading = ref(true);
const headers = ref([
  { title: "ชื่อลูกค้า", key: "customer_name" },
  { title: "เบอร์โทร", key: "customer_tel", width: "50%" },
  // { title: "", key: "actions", width: "10%" },
]);

const data = ref([]);

const getData = async () => {
  loading.value = true;

  const response = await useApiCustomers().index();
  // console.log(response.data);
  data.value = response.data;
  data.value.map((item, index) => {
    item.no = index + 1;
  });
  loading.value = false;
};
getData();

const dialog = ref(false);
const id = ref(0);
const handleClick = (e, row) => {
  dialog.value = true;
  id.value = row.item.id;
};
</script>
