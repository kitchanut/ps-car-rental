<template>
  <div class="pa-3">
    <v-card variant="outlined" style="border: 1px solid #ddd">
      <div class="d-flex ma-3">
        <DialogUser appearance="add" actionType="add" @success="getData()" />
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
        <template v-slot:item.name="{ item }">
          <v-badge :color="item.status == 'เปิดใช้งาน' ? 'success' : 'warning'" inline dot></v-badge>
          <v-chip v-if="item.level == 'แอดมิน'" class="mx-1" size="x-small" label color="primary">A</v-chip>
          <v-chip v-if="item.level == 'ผู้ใช้งานทั่วไป'" class="mx-1" size="x-small" label color="">U</v-chip>
          <v-chip v-if="item.level == 'ผู้บริหาร'" class="mx-1" size="x-small" label color="success">O</v-chip>
          {{ item.name }}
        </template>
        <template v-slot:item.branch.branch_name="{ item }">
          <span v-if="item.branch">{{ item.branch.branch_name }}</span>
          <span v-else style="color: blue">ส่วนกลาง</span>
        </template>
        <!-- <template v-slot:item.status="{ item }">
          <v-chip
            :color="item.status == 'เปิดใช้งาน' ? 'success' : 'warning'"
            size="small"
            label
            text-color="white"
          >
            {{ item.status }}
          </v-chip>
        </template> -->
        <!-- <template v-slot:item.actions="{ item }">
          <DialogUser appearance="edit" actionType="edit" :id="item.id" @success="getData()" />
        </template> -->
      </v-data-table>
    </v-card>

    <DialogUser :dialog="dialog" :id="id" actionType="edit" @success="getData()" @close="dialog = false" />
  </div>
</template>
<script setup>
const { $toast } = useNuxtApp();
const search = ref("");
const loading = ref(true);
const headers = ref([
  { title: "ชื่อผู้ใช้งาน", key: "name" },
  { title: "สาขา", key: "branch.branch_name", width: "40%" },
  // { title: "ระดับ", key: "level", width: "14%" },
]);

const data = ref([]);

const getData = async () => {
  loading.value = true;

  const response = await useApiUsers().index();
  console.log(response.data);
  data.value = response.data;
  // data.value.map((item, index) => {
  //   item.no = index + 1;
  // });
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
