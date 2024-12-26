<template>
  <div class="pa-3">
    <v-row no-gutters>
      <v-col :cols="user.branch_id ? 12 : 4">
        <v-text-field
          v-model="return_date"
          label="วันที่"
          type="date"
          density="comfortable"
          hide-details
          @input="getData()"
        ></v-text-field>
      </v-col>
      <v-col v-if="!user.branch_id" class="ml-1">
        <v-select
          :items="branches"
          item-title="branch_name"
          item-value="id"
          v-model="branch_id"
          density="comfortable"
          label="สาขา"
          hide-details
          clearable
        ></v-select>
      </v-col>
    </v-row>
    <div class="d-flex py-1"></div>
    <v-card
      v-if="displaySize == 'xs' || displaySize == 'sm'"
      v-for="item in data"
      :key="item.id"
      variant="outlined"
      class="border mb-2 rounded-lg"
      @click="handleClick(item)"
      @dblclick="handleDblClick(item)"
    >
      <v-card-title class="d-flex justify-space-between align-center">
        <div>{{ $dayjs(item.return_date).format("YYYY-MM-DD HH:mm") }}</div>
        <span style="font-size: 1rem" :style="{ color: colorBar(item.booking_status) }">{{ item.booking_number }}</span>
      </v-card-title>
      <v-card-text>
        <v-row no-gutters>
          <v-col cols="4">สถานที่:</v-col>
          <v-col class="text-right"> {{ item.return_location }} | {{ item.return_branch.branch_name }} </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col cols="4">ลูกค้า:</v-col>
          <v-col class="text-right"> {{ item.customers.customer_name }} ({{ item.customers.customer_tel }}) </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col cols="4">Facebook:</v-col>
          <v-col class="text-right"> {{ item.customers.facebook_name }} </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col cols="4">ทะเบียน:</v-col>
          <v-col class="text-right"> {{ item.cars.license_plate }} | {{ item.cars.car_models.car_model_name }} </v-col>
        </v-row>
        <!-- <v-row no-gutters>
            <v-col cols="4">ค่าเช่า:</v-col>
            <v-col class="text-right">
              <span>{{ item.sub_total.toLocaleString() }}</span> บาท
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col cols="4">มัดจำ:</v-col>
            <v-col class="text-right">
              <span>{{ item.deposit.toLocaleString() }}</span> บาท
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col cols="4">ทั้งหมด:</v-col>
            <v-col class="text-right">
              <span>{{ item.net_total.toLocaleString() }}</span> บาท
            </v-col>
          </v-row> -->
      </v-card-text>
    </v-card>

    <v-card v-else variant="outlined" class="border">
      <v-table density="compact">
        <thead>
          <tr>
            <th class="text-left px-0" width="20px"></th>
            <th class="text-left pl-2">วันที่</th>
            <th class="text-left px-2">สถานที่</th>
            <th class="text-left px-2">ลูกค้า</th>
            <th class="text-left pl-2">ทะเบียน</th>
            <th class="text-right px-2">ค่าเช่า|มัดจำ|ทั้งหมด</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-if="data.length"
            v-for="item in data"
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
              <div>{{ $dayjs(item.return_date).format("YYYY-MM-DD") }}</div>
              <div style="color: grey">{{ $dayjs(item.return_date).format("HH:mm") }}</div>
            </td>

            <td class="px-2">
              <div>
                <div>{{ item.return_location }}</div>
                <div style="color: grey">{{ item.return_branch.branch_name }}</div>
              </div>
            </td>
            <td class="px-2">
              <div>{{ item.customers.customer_name }}</div>
              <div style="color: grey">{{ item.customers.facebook_name || "N/A" }}</div>
              <div style="color: grey">{{ item.customers.customer_tel }}</div>
            </td>
            <td class="px-2">
              <div>{{ item.cars.license_plate }}</div>
              <div style="color: grey">{{ item.cars.car_models.car_model_name }}</div>
            </td>

            <td class="px-2 text-end text-green font-weight-bold">
              <div class="text-right">
                {{ item.sub_total.toLocaleString() }} | {{ item.deposit.toLocaleString() }} |
                {{ item.net_total.toLocaleString() }}
              </div>
            </td>
          </tr>
          <tr v-else>
            <td colspan="6">
              <div class="text-center">- ไม่มีข้อมูล -</div>
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-card>

    <v-card v-if="data.length == 0 && (displaySize == 'xs' || displaySize == 'sm')" class="border" variant="outlined">
      <v-card-text>
        <div class="text-center">- ไม่มีข้อมูล -</div>
      </v-card-text>
    </v-card>

    <DialogBooking :dialog="dialog" :id="id" actionType="edit" @success="getData()" @close="dialog = false" />
    <DialogBookingDetails :dialog="dialogBookingDetails" :id="id" @close="dialogBookingDetails = false" />
  </div>
</template>
<script setup>
import { useDisplay } from "vuetify";
const { name } = useDisplay();
const displaySize = computed(() => name.value);
const dayjs = useDayjs();

const supabase = useNuxtApp().$supabase;
const { $toast } = useNuxtApp();
const user = ref(localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null);
onMounted(() => {
  if (user.value.branch_id) {
    branch_id.value = user.value.branch_id;
    getData();
  } else {
    getData();
  }
});

const view = ref("card");
const loading = ref(true);
const return_date = ref(new Date().toISOString().substr(0, 10));
const data = ref([]);
const getData = async () => {
  loading.value = true;
  let startDate = dayjs(return_date.value).startOf("day").format("YYYY-MM-DD");
  let endDate = dayjs(return_date.value).endOf("day").format("YYYY-MM-DD 23:59");
  let query = supabase
    .from("bookings")
    .select("*,cars(*,car_models(*)),customers(*),return_branch:bookings_return_branch_id_fkey(*)")
    .eq("booking_status", "รับรถ")
    .gte("return_date", startDate)
    .lte("return_date", endDate)
    .order("return_date");
  if (branch_id.value != null) {
    query = query.eq("return_branch_id", branch_id.value);
  }
  const { data: response, error } = await query;
  error ? $toast.error(error.message) : (data.value = response);
  loading.value = false;
};

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

const colorBar = (status) => useStatusColor(status);

const branch_id = ref(null);
const branches = ref([]);
const getBranches = async () => {
  const { data: response, error } = await supabase.from("branches").select("*").eq("branch_status", "เปิดใช้งาน");
  if (error) {
    $toast.error(error.message);
  } else {
    branches.value = response;
  }
};
getBranches();

watch(branch_id, () => {
  getData();
});
</script>
