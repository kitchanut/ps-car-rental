<template>
  <div class="pa-3">
    <v-card variant="outlined" style="border: 1px solid #ddd">
      <div class="d-flex ma-3">
        <DialogBooking appearance="add" actionType="add" @success="getData()" />
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
        <template v-slot:item.booking_number="{ item }">
          <v-chip color="warning" density="comfortable">{{ item.booking_number }}</v-chip>
        </template>
      </v-data-table>
    </v-card>

    <DialogBooking :dialog="dialog" :id="id" actionType="edit" @success="getData()" @close="dialog = false" />
  </div>
</template>
<script setup>
const { $toast } = useNuxtApp();
const search = ref("");
const loading = ref(true);
const headers = ref([
  { title: "Booking No", key: "booking_number", width: "29%", sortable: false },
  {
    title: "รับรถ",
    key: "pickup_date",
    value: (item) => `${useGlobalFunction().toDateLocal(item.pickup_date)}`,
    width: "30%",
  },
  { title: "ลูกค้า", key: "customer.customer_name" },
]);

const data = ref([]);

const getData = async () => {
  loading.value = true;

  const response = await useApiBookings().index();
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
