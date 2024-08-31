<template>
  <div class="pa-3">
    <v-card variant="outlined" style="border: 1px solid #ddd">
      <div class="text-right pt-2 px-2 mb-2">
        <v-btn-toggle v-model="period" color="warning" variant="outlined" divided density="compact">
          <v-btn value="lastDay"><b>เมื่อวาน</b></v-btn>
          <v-btn value="D"><b>วันนี้</b></v-btn>
          <v-btn value="nextDay"><b>วันพรุ่งนี้</b></v-btn>
        </v-btn-toggle>
      </div>
      <div class="text-right px-2">
        <v-badge color="grey" inline dot></v-badge>รอรับรถ <v-badge color="error" inline dot></v-badge>รอคืนรถ
      </div>
      <v-divider></v-divider>
      <v-table density="compact">
        <thead>
          <tr>
            <th class="text-left px-0" width="20px"></th>
            <th class="text-left pl-2">รถเช่า</th>
            <th class="text-left px-2">ลูกค้า</th>
            <th class="text-left px-2">สถานที่</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-if="data.length"
            v-for="item in data"
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
                  style="
                    border-radius: 0px;

                    height: 100%;
                    width: 20px;
                    align-items: center;
                    vertical-align: middle;
                  "
                  :style="{ color: colorBar(item.booking_status) }"
                >
                  <span class="v-chip__underlay"></span>
                  <div class="v-chip__content">{{ item.booking_number }}</div>
                </span>
              </div>
            </td>
            <td class="px-2">
              <div>{{ item.car.license_plate }}</div>
              <div style="color: grey">{{ item.car.car_model.car_model_name }}</div>
            </td>
            <td class="px-2">
              <div>{{ item.customer.customer_name }}</div>
              <div style="color: grey">{{ item.customer.customer_tel }}</div>
            </td>
            <td class="px-2">
              <div v-if="item.booking_status == 'มัดจำ'">
                <div>{{ item.pickup_location }}</div>
                <div style="color: grey">{{ item.pickup_branch.branch_name }}</div>
              </div>
              <div v-if="item.booking_status == 'รับรถ'">
                <div>{{ item.return_location }}</div>
                <div style="color: grey">{{ item.return_branch.branch_name }}</div>
              </div>
            </td>
          </tr>
          <tr v-else>
            <td colspan="4">
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
const headers = ref([
  { title: "", key: "booking_number", width: "0%", sortable: false },
  {
    title: "รถ",
    key: "car.license_plate",
    width: "30%",
  },
  { title: "ลูกค้า", key: "customer.customer_name" },
]);
const period = ref("D");
const loading = ref(true);
const data = ref([]);
const getData = async () => {
  loading.value = true;
  let queryString = `?query_period_by=pickup_date&period=${period.value}&status=มัดจำ`;
  const response = await useApiBookings().index(queryString);
  // console.log(response.data);
  data.value = response.data;
  let queryStringPickup = `?query_period_by=return_date&period=${period.value}&status=รับรถ`;
  const responsePickup = await useApiBookings().index(queryStringPickup);
  // merge data
  data.value = response.data.concat(responsePickup.data);
  loading.value = false;
};
getData();

watch(
  () => period.value,
  () => {
    getData();
  }
);

const dialog = ref(false);
const id = ref(0);

const colorBar = (status) => {
  if (status == "จอง") return "#FB8C00";
  if (status == "มัดจำ") return "#9E9E9E";
  if (status == "รับรถ") return "#B00020";
  if (status == "คืนรถ") return "#1966C0";
  if (status == "คืนมัดจำ") return "#4CAF4F";
};
</script>
