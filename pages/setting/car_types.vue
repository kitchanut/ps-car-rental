<template>
  <div class="pa-3">
    <v-card variant="outlined" style="border: 1px solid #ddd">
      <div class="d-flex ma-3">
        <DialogCarType appearance="add" actionType="add" @success="getData()" />
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
        <template v-slot:item.car_type_name="{ item }">
          <v-badge :color="item.car_type_status == 'เปิดใช้งาน' ? 'success' : 'warning'" inline dot></v-badge>
          {{ item.car_type_name }}
        </template>
        <!-- <template v-slot:item.car_type_status="{ item }">
            <v-chip
              :color="item.car_type_status == 'เปิดใช้งาน' ? 'success' : 'warning'"
              size="small"
              label
              text-color="white"
            >
              {{ item.car_type_status }}
            </v-chip>
          </template> -->
        <!-- <template v-slot:item.actions="{ item }">
            <DialogCarType appearance="edit" actionType="edit" :id="item.id" @success="getData()" />
          </template> -->
      </v-data-table>
    </v-card>

    <DialogCarType :dialog="dialog" :id="id" actionType="edit" @success="getData()" @close="dialog = false" />
  </div>
</template>
<script setup>
const { $toast } = useNuxtApp();
const search = ref("");
const loading = ref(true);
const headers = ref([
  { title: "ชื่อสาขา", key: "car_type_name" },
  // { title: "สถานะ", key: "car_type_status", width: "10%" },
  // { title: "", key: "actions", width: "10%" },
]);

const data = ref([]);

const getData = async () => {
  loading.value = true;

  const response = await useApiCarTypes().index();
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
