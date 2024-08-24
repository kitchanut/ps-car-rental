<template>
  <div class="pa-3">
    <v-card variant="outlined" style="border: 1px solid #ddd" :loading="loading">
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
      <div class="text-right px-2">
        <v-badge color="warning" inline dot></v-badge>จอง <v-badge color="grey" inline dot></v-badge>มัดจำ
        <v-badge color="error" inline dot></v-badge>รับรถ <v-badge color="primary" inline dot></v-badge>คืนรถ
        <v-badge color="success" inline dot></v-badge>คืนมัดจำ
      </div>

      <div class="text-right px-2 mb-2">
        <v-btn-toggle v-model="period" color="warning" variant="outlined" divided density="compact" :disabled="loading">
          <v-btn value="D" size="small" style="min-width: 20px"><b>D</b></v-btn>
          <v-btn value="W" size="small" style="min-width: 20px"><b>W</b></v-btn>
          <v-btn value="M" size="small" style="min-width: 20px"><b>M</b></v-btn>
          <v-btn value="3M" size="small" style="min-width: 20px"><b>3M</b></v-btn>
          <v-btn value="6M" size="small" style="min-width: 20px"><b>6M</b></v-btn>
          <v-btn value="Y" size="small" style="min-width: 20px"><b>Y</b></v-btn>
          <v-btn value="2Y" size="small" style="min-width: 20px"><b>2Y</b></v-btn>
          <v-btn value="3Y" size="small" style="min-width: 20px"><b>3Y</b></v-btn>
        </v-btn-toggle>
      </div>

      <v-divider></v-divider>
      <v-table density="compact">
        <thead>
          <tr>
            <th class="text-left px-0" width="20px"></th>
            <th class="text-left px-2">จอง|รับรถ</th>
            <th class="text-left pl-2">รถเช่า</th>
            <th class="text-left px-2">ลูกค้า</th>
            <th class="text-right px-2">รวม</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-if="dataFiltered.length"
            v-for="item in dataFiltered"
            :key="item.name"
            @click="
              id = item.id;
              dialog = true;
            "
          >
            <td class="px-0">
              <div class="vertical-text" style="width: 20px">
                <span
                  class="py-1 v-chip v-chip--label v-theme--light v-chip--density-compact v-chip--size-small v-chip--variant-tonal"
                  draggable="false"
                  style="border-radius: 0px; height: 100%; width: 20px; align-items: center; vertical-align: middle"
                  :style="{ color: colorBar(item.booking_status) }"
                >
                  <span class="v-chip__underlay"></span>
                  <div class="v-chip__content">{{ item.booking_number }}</div>
                </span>
              </div>
            </td>
            <td class="px-2">
              <div>{{ $dayjs(item.booking_date).format("YYYY-MM-DD") }}</div>
              <div style="color: grey">{{ $dayjs(item.pickup_date).format("YYYY-MM-DD") }}</div>
            </td>
            <td class="px-2">
              <div>{{ item.car.license_plate }}</div>
              <div style="color: grey">{{ item.car.car_model.car_model_name }}</div>
            </td>
            <td class="px-2">
              <div>{{ item.customer.customer_name }}</div>
              <div style="color: grey">{{ item.customer.customer_tel }}</div>
            </td>
            <td align="end" class="px-2">
              <div style="color: green">{{ Number(item.sub_total).toLocaleString() }}</div>
            </td>
          </tr>
          <tr v-else>
            <td colspan="5">
              <div class="text-center">- ไม่มีข้อมูล -</div>
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-card>

    <DialogBooking :dialog="dialog" :id="id" actionType="edit" @success="getData()" @close="dialog = false" />
  </div>
</template>
<script setup>
const { $toast } = useNuxtApp();
const search = ref("");
const loading = ref(true);
const period = ref("D");
const data = ref([]);
const getData = async () => {
  loading.value = true;
  let queryString = `?query_period_by=booking_date&period=${period.value}`;
  const response = await useApiBookings().index(queryString);
  // console.log(response.data);
  data.value = response.data;
  loading.value = false;
};
getData();

const dataFiltered = computed(() => {
  return data.value.filter((item) => {
    return (
      item.booking_number.toLowerCase().includes(search.value.toLowerCase()) ||
      item.car.license_plate.toLowerCase().includes(search.value.toLowerCase()) ||
      item.customer.customer_name.toLowerCase().includes(search.value.toLowerCase()) ||
      item.customer.customer_tel.toLowerCase().includes(search.value.toLowerCase())
    );
  });
});
watch(
  () => period.value,
  () => {
    getData();
  }
);

const colorBar = (status) => {
  if (status == "จอง") return "#FB8C00";
  if (status == "มัดจำ") return "#9E9E9E";
  if (status == "รับรถ") return "#B00020";
  if (status == "คืนรถ") return "#1966C0";
  if (status == "คืนมัดจำ") return "#4CAF4F";
};

const dialog = ref(false);
const id = ref(0);
</script>
