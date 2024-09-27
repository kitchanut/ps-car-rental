<template>
  <div class="pa-3">
    <v-card variant="outlined" style="border: 1px solid #ddd" :loading="loading">
      <div>
        <v-row>
          <v-col cols="8"> </v-col>
          <v-col cols="4">
            <v-select
              :items="years"
              v-model="year"
              density="compact"
              hide-details
              @update:model-value="getData()"
            ></v-select>
          </v-col>
        </v-row>
      </div>

      <v-divider></v-divider>
      <v-table density="compact">
        <thead>
          <tr>
            <th class="text-left pl-2 pr-1" style="border-right: 1px solid #eee">รถเช่า</th>
            <th v-for="month in 12" class="text-center px-1">{{ month }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="car in cars">
            <td class="pl-2 pr-1" style="border-right: 1px solid #eee">
              {{ car.license_plate }}
            </td>
            <td align="center" v-for="month in 12" class="px-1">
              <div>{{ findBooking(car.id, month) }}</div>
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-card>
  </div>
</template>
<script setup>
const loading = ref(false);
const year = ref(new Date().getFullYear());
const years = ref([new Date().getFullYear(), new Date().getFullYear() - 1, new Date().getFullYear() - 2]);

onMounted(() => {
  getCars();
  getData();
});

const cars = ref([]);
const getCars = async () => {
  loading.value = true;
  const response = await useApiCars().index();
  cars.value = response.data;
};

const data = ref([]);
const getData = async () => {
  loading.value = true;
  let params = {
    year: year.value,
  };
  const response = await useApiReports().bookingsByMonth(params);
  data.value = response.data;

  loading.value = false;
};

const findBooking = (car_id, month) => {
  let find = data.value.find((item) => item.car_id === car_id && item.month === month);
  return find ? find.count : "";
};
</script>
