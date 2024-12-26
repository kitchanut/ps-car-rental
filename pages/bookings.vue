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

      <div class="text-right px-2 mb-2">
        <v-btn-toggle v-model="period" color="warning" variant="outlined" divided density="compact" :disabled="loading">
          <v-btn value="D" size="small" style="min-width: 20px"><b>D</b></v-btn>
          <v-btn value="W" size="small" style="min-width: 20px"><b>W</b></v-btn>
          <v-btn value="M" size="small" style="min-width: 20px"><b>M</b></v-btn>
          <v-btn value="3M" size="small" style="min-width: 20px"><b>3M</b></v-btn>
          <v-btn value="6M" size="small" style="min-width: 20px"><b>6M</b></v-btn>
          <v-btn value="Y" size="small" style="min-width: 20px"><b>Y</b></v-btn>
        </v-btn-toggle>
      </div>
      <div class="text-right px-2">
        <v-badge :color="colorBar('จอง')" inline dot></v-badge>จอง
        <v-badge :color="colorBar('รับเงินจอง')" inline dot></v-badge>มัดจำ
        <v-badge :color="colorBar('รับรถ')" inline dot></v-badge>รับรถ
        <v-badge :color="colorBar('คืนรถ')" inline dot></v-badge>คืนรถ
        <v-badge :color="colorBar('คืนมัดจำ')" inline dot></v-badge>คืนมัดจำ
        <v-badge :color="colorBar('ยกเลิก')" inline dot></v-badge>ยกเลิก
      </div>

      <v-divider></v-divider>
      <v-table density="compact">
        <thead>
          <tr>
            <th class="text-left px-0" width="20px"></th>
            <th class="text-left px-2">จอง|รับรถ</th>
            <th class="text-left pl-2">รถเช่า</th>
            <th class="text-left px-2">ลูกค้า</th>
            <th class="text-right px-2">ค่าเช่า</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-if="dataFiltered.length"
            v-for="item in dataFiltered"
            :key="item.name"
            @click="handleClick(item)"
            @dblclick="handleDblClick(item)"
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
              <div>{{ item.cars.license_plate }}</div>
              <div style="color: grey">{{ item.cars.car_models.car_model_name }}</div>
            </td>
            <td class="px-2">
              <div>{{ item.customers.customer_name }}</div>
              <div style="color: grey">{{ item.customers.customer_tel }}</div>
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
    <DialogBookingDetails :dialog="dialogBookingDetails" :id="id" @close="dialogBookingDetails = false" />
  </div>
</template>
<script setup>
const dayjs = useDayjs();
const supabase = useNuxtApp().$supabase;
const { $toast } = useNuxtApp();
const user = ref(localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null);

onMounted(() => {
  getData();
});
const search = ref("");
const loading = ref(true);
const period = ref("D");
const data = ref([]);
const getData = async () => {
  loading.value = true;

  let startDate;
  let endDate;
  if (period.value == "D") {
    startDate = dayjs().startOf("day").format("YYYY-MM-DD");
    endDate = dayjs().endOf("day").format("YYYY-MM-DD 23:59");
  } else if (period.value == "W") {
    startDate = dayjs().startOf("week").format("YYYY-MM-DD");
    endDate = dayjs().endOf("week").format("YYYY-MM-DD 23:59");
  } else if (period.value == "M") {
    startDate = dayjs().startOf("month").format("YYYY-MM-DD");
    endDate = dayjs().endOf("month").format("YYYY-MM-DD 23:59");
  } else if (period.value == "3M") {
    startDate = dayjs().startOf("month").subtract(3, "month").format("YYYY-MM-DD");
    endDate = dayjs().endOf("month").format("YYYY-MM-DD 23:59");
  } else if (period.value == "6M") {
    startDate = dayjs().startOf("month").subtract(6, "month").format("YYYY-MM-DD");
    endDate = dayjs().endOf("month").format("YYYY-MM-DD 23:59");
  } else if (period.value == "Y") {
    startDate = dayjs().startOf("year").format("YYYY-MM-DD");
    endDate = dayjs().endOf("year").format("YYYY-MM-DD 23:59");
  }

  let query = supabase
    .from("bookings")
    .select("*,cars(*,car_models(*)),customers(*)")
    .gte("booking_date", startDate)
    .lte("booking_date", endDate)
    .order("created_at", { ascending: false });
  if (user.value.branch_id) {
    query = query.eq("branch_id", user.value.branch_id);
  }
  const { data: response, error } = await query;

  error ? $toast.error(error.message) : (data.value = response);
  loading.value = false;
};

const dataFiltered = computed(() => {
  return data.value.filter((item) => {
    return (
      item.booking_number.toLowerCase().includes(search.value.toLowerCase()) ||
      item.car.license_plate.toLowerCase().includes(search.value.toLowerCase()) ||
      item.car.car_model.car_model_name.toLowerCase().includes(search.value.toLowerCase()) ||
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

const colorBar = (status) => useStatusColor(status);

const dialog = ref(false);
const dialogBookingDetails = ref(false);
const id = ref(0);

const handleDblClick = (item) => {
  id.value = item.id;
  clickEvent.value = "dbclick";
  clickEventDialog(item);
};

const handleClick = (item) => {
  id.value = item.id;
  clickEvent.value = "click";
  clickEventDialog(item);
};

// Select Dialog
const clickEvent = ref(null);
const clickEventDialog = (item) => {
  setTimeout(() => {
    if (clickEvent.value == "click") {
      dialog.value = true;
    } else if (clickEvent.value == "dbclick") {
      dialogBookingDetails.value = true;
    }
  }, 200);
};
</script>
