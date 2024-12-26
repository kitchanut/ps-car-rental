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
const supabase = useNuxtApp().$supabase;
const { $toast } = useNuxtApp();

const loading = ref(false);
const items = ref([]);
const getData = async () => {
  loading.value = true;
  try {
    loading.value = true;
    let { data: cars, error } = await supabase.from("cars").select("*");
    items.value[0] = {
      title: "จํานวนรถ",
      value: cars.length,
      color: "primary",
      icon: "mdi-car",
    };
    let { data: customers, error: error2 } = await supabase.from("customers").select("*");
    items.value[1] = {
      title: "จํานวนลูกค้า",
      value: customers.length,
      color: "success",
      icon: "mdi-account",
    };
  } catch (error) {
    $toast.error(error.message);
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
    let { data, error } = await supabase.rpc("booking_by_month", {
      year: year.value,
    });

    if (error) {
      $toast.error(error.message);
      return;
    }

    let chartData = [];
    for (let i = 1; i <= 12; i++) {
      let find = data.find((item) => item.month === i);
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
        data: chartData,
      },
    ];
  } catch (error) {
    $toast.error(error.message);
  }
  loading.value = false;
};
getBookingByMonth();
</script>
