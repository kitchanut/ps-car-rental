<template>
  <div class="pa-3">
    <v-text-field
      v-model="search"
      append-inner-icon="mdi-magnify"
      label="ค้นหา"
      single-line
      hide-details
    ></v-text-field>

    <v-data-table :headers="headers" :items="items" :search="search" :items-per-page="-1">
      <template v-slot:headers> </template>
      <template v-if="loading" v-slot:thead>
        <tr>
          <td colspan="2">
            <v-progress-linear indeterminate color="yellow-darken-2"></v-progress-linear>
          </td>
        </tr>
      </template>
      <template v-slot:item="{ item }">
        <tr>
          <td
            style="border-bottom: thin solid #ddd"
            class="color-corner"
            :class="item.status == 'เปิดใช้งาน' ? 'active' : 'inactive'"
          >
            {{ item.name }}
          </td>
          <td style="border-bottom: thin solid #ddd">
            <DialogUser actionType="edit" :id="item.id" @success="getData()" />
            <v-btn
              class="ml-1"
              color="red"
              icon="mdi-delete"
              density="comfortable"
              size="small"
              variant="tonal"
              @click="
                dialogDelete = true;
                id = item.id;
              "
            >
            </v-btn>
          </td>
        </tr>
      </template>
      <template v-slot:bottom> </template>
    </v-data-table>
  </div>
</template>
<script setup>
const search = ref("");
const headers = reactive([
  {
    align: "start",
    key: "name",
    title: "ชื่อ",
  },
  { key: "actions", title: "จัดการ", width: "10%" },
]);

const loading = ref(true);
const items = ref([]);

const getData = async () => {
  loading.value = true;
  const response = await useApiUsers().index();
  console.log(response.data);
  items.value = response.data;
  loading.value = false;
};
getData();

const id = ref(0);
const dialogDelete = ref(false);
const deleteItem = async () => {
  dialogDelete.value = false;
  const response = await useApiUsers().destroy(id.value);
  response.status == 200
    ? ($toast.success("ลบสำเร็จ"), getData())
    : $toast.error("เกิดข้อผิดพลาด! กรุณาติดต่อผู้แลระบบ");
};
</script>

<style lang="scss" scoped>
.color-corner {
  position: relative;
  &:before {
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    content: "";
    height: 100%;
  }
}

.wating:before {
  border-left: 5px solid #fb8c00;
}
.active:before {
  border-left: 5px solid #4caf50;
}
.inactive:before {
  border-left: 5px solid #b00020;
}
</style>
