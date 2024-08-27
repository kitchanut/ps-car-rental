<template>
  <div class="pa-3">
    <v-card variant="outlined" style="border: 1px solid #ddd">
      <div class="d-flex ma-3">
        <DialogAccount appearance="add" actionType="add" @success="getData()" />
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
      >
        <template v-slot:item.account_number="{ item }">
          <v-badge :color="item.account_status == 'เปิดใช้งาน' ? 'success' : 'warning'" inline dot></v-badge>
          <span
            style="color: blue"
            @click="
              id = item.id;
              dialog = true;
            "
            >{{ item.account_number }}</span
          >
        </template>
        <template v-slot:item.actions="{ item }">
          <DialogAccountTransactionTable appearance="list" :account_id="item.id" :number="item.account_number" />
        </template>
      </v-data-table>
    </v-card>

    <DialogAccount :dialog="dialog" :id="id" actionType="edit" @success="getData()" @close="dialog = false" />
  </div>
</template>
<script setup>
const { $toast } = useNuxtApp();
const search = ref("");
const loading = ref(true);
const headers = ref([
  { title: "เลขที่บัญชี", key: "account_number" },
  { title: "ชื่อบัญชี", key: "account_name" },
  { title: "", key: "actions", width: "10%" },
]);

// Commonvariable
const dialog = ref(false);
const id = ref(0);
const data = ref([]);
const getData = async () => {
  loading.value = true;
  const response = await useApiAccounts().index();
  data.value = response.data;
  loading.value = false;
};
getData();
</script>
