<template>
  <div class="pa-3">
    <v-row no-gutters>
      <v-col class="pr-2 pb-1" lg="6" md="6" sm="6" cols="12" v-for="item in items">
        <v-card variant="outlined" class="border">
          <v-card-text>
            <div class="d-flex">
              <div>
                <div>{{ item.title }}</div>
                <div style="font-size: 32px" :class="`text-${item.color}`">{{ item.value }}</div>
              </div>
              <v-spacer></v-spacer>
              <v-btn variant="tonal" :color="item.color" density="compact" style="height: 64px">
                <v-icon size="32px">{{ item.icon }}</v-icon>
              </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <div class="pr-2 pt-1">
      <v-card variant="outlined" class="border">
        <div>
          <v-row>
            <v-col class="pa-5"> ยอดจองรายเดือน </v-col>
            <v-col lg="3" md="3" sm="3" xs="3" cols="5">
              <v-select
                :items="years"
                v-model="year"
                density="compact"
                hide-details
                @update:model-value="getBookingByMonth()"
              ></v-select>
            </v-col>
          </v-row>
        </div>
        <v-divider></v-divider>
        <ChartComponent :xAxis="xAxis" :series="series" />
      </v-card>
    </div>
  </div>
</template>
<script setup>
const loading = ref(false);
const items = ref([]);
const getData = async () => {
  loading.value = true;
  try {
    loading.value = true;
    const response = await useApiDashboards().card();
    // console.log(response.data);
    items.value = response.data;
  } catch (error) {
    console.log(error);
  }
  loading.value = false;
};
getData();

const year = ref(new Date().getFullYear());
const years = ref([new Date().getFullYear(), new Date().getFullYear() - 1, new Date().getFullYear() - 2]);
const series = ref([]);
const xAxis = ref({
  type: "category",
  data: ["ม.ค", "ก.พ", "มี.ค", "เม.ย", "พ.ค", "มิ.ย", "ก.ค", "ส.ค", "ก.ย", "ต.ค", "พ.ย", "ธ.ค"],
});
const getBookingByMonth = async () => {
  loading.value = true;
  try {
    loading.value = true;
    let params = {
      year: year.value,
    };
    const response = await useApiDashboards().bookingByMonth(params);
    console.log(response.data);
    let chartData = [];
    for (let i = 1; i <= 12; i++) {
      let find = response.data.find((item) => item.month === i);
      if (find) {
        chartData.push(find.count);
      } else {
        chartData.push(0);
      }
    }
    series.value = [
      {
        name: "จำนวนการจอง",
        type: "bar",
        // label: {
        //   show: true,
        //   position: "top",
        // },
        data: chartData,
      },
    ];
    // console.log(series.value);
  } catch (error) {
    console.log(error);
  }
  loading.value = false;
};
getBookingByMonth();
</script>
