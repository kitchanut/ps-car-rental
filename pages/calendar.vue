<template>
  <div class="pa-3">
    <v-card variant="outlined" style="border: 1px solid #ddd" :loading="loading">
      <div class="pa-3 d-flex">
        <DialogBooking appearance="add" actionType="add" @success="getData()" />
        <v-menu width="340" :close-on-content-click="false">
          <template v-slot:activator="{ props }">
            <v-btn
              class="ml-2"
              color="warning"
              variant="tonal"
              v-bind="props"
              style="height: 41px; min-width: 41px; padding: 0 10px"
            >
              <v-icon>mdi-filter</v-icon>
            </v-btn>
          </template>
          <v-card>
            <v-card-text>
              <v-select
                v-if="!user.branch_id"
                :items="branches"
                item-title="branch_name"
                item-value="id"
                v-model="branch_id"
                density="comfortable"
                label="สาขา"
                hide-details
                clearable
              ></v-select>

              <v-select
                class="mt-2"
                :items="car_types"
                item-title="car_type_name"
                item-value="id"
                v-model="car_type_id"
                density="comfortable"
                label="ประเภทรถ"
                hide-details
                clearable
              ></v-select>

              <v-select
                class="mt-2"
                :items="car_brands"
                item-title="car_brand_name"
                item-value="id"
                v-model="car_brand_id"
                density="comfortable"
                label="ยี่ห้อรถ"
                hide-details
                clearable
              ></v-select>

              <v-select
                class="mt-2"
                :items="car_model_filters"
                item-title="car_model_name"
                item-value="id"
                v-model="car_model_id"
                density="comfortable"
                label="รุ่นรถ"
                hide-details
                clearable
              ></v-select>

              <v-text-field
                class="mt-2"
                v-model="startDateFilter"
                type="datetime-local"
                density="comfortable"
                label="วันที่เริ่ม"
                hide-details
                clearable
              ></v-text-field>

              <v-text-field
                class="mt-2"
                v-model="endDateFilter"
                type="datetime-local"
                density="comfortable"
                label="วันที่สิ้นสุด"
                hide-details
                clearable
              ></v-text-field>

              <v-slider
                class="mt-3"
                v-model="price"
                color="primary"
                :step="1"
                max="5000"
                hideDetails
                style="margin-inline: 0px"
              >
                <template v-slot:append>
                  <v-text-field
                    v-model="price"
                    density="compact"
                    style="width: 80px"
                    type="number"
                    variant="outlined"
                    hide-details
                  ></v-text-field>
                </template>
              </v-slider>
            </v-card-text>
          </v-card>
        </v-menu>
        <v-text-field
          class="pl-3"
          v-model="search"
          append-inner-icon="mdi-magnify"
          label="ค้นหา ทะเบียน รุ่นรถ"
          single-line
          hide-details
          density="compact"
        ></v-text-field>
      </div>
      <div class="text-right px-3">
        <v-badge :color="colorBar('จอง')" inline dot></v-badge>จอง
        <v-badge :color="colorBar('รับเงินจอง')" inline dot></v-badge>มัดจำ
        <v-badge :color="colorBar('รับรถ')" inline dot></v-badge>รับรถ
        <v-badge :color="colorBar('คืนรถ')" inline dot></v-badge>คืนรถ
        <v-badge :color="colorBar('คืนมัดจำ')" inline dot></v-badge>คืนมัดจำ
      </div>

      <div>
        <v-card variant="outlined" color="#eee" class="rounded-0">
          <div style="overflow-x: scroll; overflow-y: visible" :style="`width: ${innerWidth}px;`">
            <g-gantt-chart
              class="g-gantt-chart-custom"
              :chart-start="$dayjs().add(-7, 'day').format('YYYY-MM-DD 00:00')"
              :chart-end="$dayjs().add(60, 'day').format('YYYY-MM-DD 00:00')"
              precision="day"
              label-column-width="300px"
              grid
              width="2600px"
              row-height="65"
              bar-start="begin"
              bar-end="end"
              @click-bar="onClickedBar"
              @dblclick-bar="onMouseupBar"
            >
              <g-gantt-row v-for="item in filterData" :label="item.license_plate" :bars="item.bookings">
                <template #label>
                  <div
                    class="d-flex pr-2"
                    style="position: fixed; margin-left: 6px; background-color: white; border: 1px solid #eee"
                  >
                    <!-- <div
                      style="border-right: 1px solid #ccc; padding: 5px 5px; min-width: 85px; text-align: center"
                      @click="
                        dialogCar = true;
                        id = item.id;
                      "
                    >
                      <div style="color: #1966c0">
                        <b>{{ item.license_plate }}</b>
                      </div>
                      <div style="font-size: 0.7rem">{{ item.license_plate_province }}</div>
                      <div>
                        <v-chip :color="item.branch.branch_color" label density="compact" size="x-small">
                          {{ item.branch.branch_name }}
                        </v-chip>
                      </div>
                    </div> -->
                    <div class="d-flex justify-center align-center" style="width: 20px">
                      <div>
                        <v-chip
                          :color="item.color_code"
                          class="d-flex justify-center align-center"
                          label
                          variant="flat"
                          density="compact"
                          size="x-small"
                          style="transform: rotate(90deg); width: 60px; height: 100%"
                        >
                          {{ item.color }}
                        </v-chip>
                      </div>
                    </div>
                    <div class="vertical-text" style="border-left: 1px solid #ccc; width: 20px">
                      <div>
                        {{ item.year }}
                      </div>
                    </div>
                    <div class="text-center" style="border-left: 1px solid #ccc; padding: 5px 16px">
                      <div
                        @click="
                          dialogCar = true;
                          id = item.id;
                        "
                      >
                        <b>{{ item.car_models.car_model_name }}</b>
                      </div>
                      <div
                        style="color: green; font-size: 0.7rem"
                        @click="
                          dialogCar = true;
                          id = item.id;
                        "
                      >
                        <b>{{ item.rental_per_day.toLocaleString() }}</b>
                      </div>
                      <b
                        style="color: #1966c0"
                        @click="
                          dialogCar = true;
                          id = item.id;
                        "
                        >{{ item.license_plate }}</b
                      >

                      <!-- <v-chip :color="item.color_code" label variant="flat" density="compact" size="x-small">
                        {{ item.color }}
                      </v-chip> -->
                      <v-btn
                        style="position: absolute; top: 2px; right: -10px"
                        density="compact"
                        dark
                        :icon="drawer ? 'mdi-chevron-left' : 'mdi-chevron-right'"
                        @click="
                          drawer = !drawer;
                          id = item.id;
                        "
                      >
                      </v-btn>
                      <DialogBooking
                        :car_id="item.id"
                        :branch_id="item.branches.id"
                        appearance="float"
                        actionType="add"
                        @success="getData()"
                      />
                    </div>
                  </div>
                </template>
              </g-gantt-row>
            </g-gantt-chart>
          </div>
        </v-card>
      </div>

      <DialogBooking
        :dialog="dialogBooking"
        :id="id"
        actionType="edit"
        @success="getData()"
        @close="dialogBooking = false"
      />
      <DialogBookingDetails :dialog="dialogBookingDetails" :id="id" @close="dialogBookingDetails = false" />
      <DialogCar :dialog="dialogCar" :id="id" actionType="edit" @success="getData()" @close="dialogCar = false" />
      <DrawerFile :drawer="drawer" :id="id" type="car" @close="drawer = false" />
    </v-card>
  </div>
</template>
<script setup>
const supabase = useNuxtApp().$supabase;
const { $toast } = useNuxtApp();
const dayjs = useDayjs();

// Display Size
import { useDisplay } from "vuetify";
const { name } = useDisplay();
const displaySize = computed(() => name.value);

const innerWidth = ref(0);
if (displaySize.value == "xs" || displaySize.value == "sm") {
  innerWidth.value = window.innerWidth - 28;
} else {
  innerWidth.value = 850 - 223.5;
}
const user = ref(localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null);
onMounted(() => {
  if (user.value.branch_id) {
    branch_id.value = user.value.branch_id;
  }
});

// Get Car
const loading = ref(true);
const data = ref([]);
const getData = async () => {
  loading.value = true;
  let startDate = dayjs().add(-7, "day").format("YYYY-MM-DD");
  let endDate = dayjs().add(60, "day").format("YYYY-MM-DD");
  let query = supabase
    .from("cars")
    .select("*,car_models(*),bookings(*),branches(*)")
    .gte("bookings.pickup_date", startDate)
    .lte("bookings.pickup_date", endDate)
    .neq("bookings.booking_status", "ยกเลิก")
    .order("created_at", { ascending: false });
  const { data: response, error } = await query;
  error ? $toast.error(error.message) : (data.value = response);

  data.value = response;
  data.value.map((item, index) => {
    item.car_model_name = item.car_models.car_model_name;
    item.branch_name = item.branches.branch_name;
    item.bookings.map((booking) => {
      booking.begin = dayjs(booking.pickup_date).format("YYYY-MM-DD HH:mm");
      if (booking.booking_returns) {
        booking.end = dayjs(booking.booking_returns.return_date).format("YYYY-MM-DD HH:mm");
      } else {
        booking.end = dayjs(booking.return_date).format("YYYY-MM-DD HH:mm");
      }

      booking.ganttBarConfig = {
        id: booking.id,
        style: {
          fontSize: "0.8rem",
          background: colorBar(booking.booking_status),
          borderRadius: "4px",
          color: "white",
        },
      };
    });
  });

  loading.value = false;
};
getData();

const colorBar = (status) => useStatusColor(status);

const filterData = computed(() => {
  return data.value.filter((item) => {
    return (
      (item.license_plate.toLowerCase().includes(search.value.toLowerCase()) ||
        item.car_model_name.toLowerCase().includes(search.value.toLowerCase())) &&
      (branch_id.value ? item.branch_id == branch_id.value : true) &&
      (car_type_id.value ? item.car_type_id == car_type_id.value : true) &&
      (car_brand_id.value ? item.car_brand_id == car_brand_id.value : true) &&
      (car_model_id.value ? item.car_model_id == car_model_id.value : true) &&
      item.rental_per_day <= price.value &&
      CheckAvailableDays(item)
    );
  });
});

const startDateFilter = ref(null);
const endDateFilter = ref(null);
const CheckAvailableDays = (item) => {
  if (startDateFilter.value && endDateFilter.value) {
    if (item.bookings.length) {
      let find;
      item.bookings.map((booking) => {
        const pickupDate = dayjs(booking.pickup_date);
        const returnDate = dayjs(booking.return_date);
        const filterStartDate = dayjs(startDateFilter.value);
        const filterEndDate = dayjs(endDateFilter.value);
        if (pickupDate.isBetween(filterStartDate, filterEndDate)) {
          find = false;
        } else if (returnDate.isBetween(filterStartDate, filterEndDate)) {
          find = false;
        } else {
          find = true;
        }
      });
      return find;
    } else {
      return true;
    }
  } else {
    return true;
  }
};

// Additional Information
const id = ref(0);
const dialogBooking = ref(false);
const dialogBookingDetails = ref(false);
const dialogCar = ref(false);
const drawer = ref(false);

// Click Bar
const onClickedBar = (item) => {
  clickEvent.value = "click";
  id.value = item.bar.id;
  clickEventDialog();
};

// Double Click Bar
const onMouseupBar = (item) => {
  clickEvent.value = "dbclick";
  id.value = item.bar.id;
  clickEventDialog();
};

// Select Dialog
const clickEvent = ref(null);
const clickEventDialog = (item) => {
  setTimeout(() => {
    if (clickEvent.value == "click") {
      dialogBooking.value = true;
    } else if (clickEvent.value == "dbclick") {
      dialogBookingDetails.value = true;
    }
  }, 200);
};

// Filter
const search = ref("");
const branch_id = ref(null);
const car_type_id = ref(null);
const car_brand_id = ref(null);
const car_model_id = ref(null);
const price = ref(5000);
// Get Filter
onMounted(() => {
  getBranches();
  getCarTypes();
  getCarBrands();
  getCarModels();
});
const branches = ref([]);
const getBranches = async () => {
  const { data: response, error } = await supabase.from("branches").select("*").eq("branch_status", "เปิดใช้งาน");
  if (error) {
    $toast.error(error.message);
  } else {
    branches.value = response;
  }
};

const car_types = ref([]);
const getCarTypes = async () => {
  const { data: response, error } = await supabase.from("car_types").select("*").eq("car_type_status", "เปิดใช้งาน");
  if (error) {
    $toast.error(error.message);
  } else {
    car_types.value = response;
  }
};

const car_brands = ref([]);
const getCarBrands = async () => {
  const { data: response, error } = await supabase.from("car_brands").select("*").eq("car_brand_status", "เปิดใช้งาน");
  if (error) {
    $toast.error(error.message);
  } else {
    car_brands.value = response;
  }
};

const getCarModels = async () => {
  const { data: response, error } = await supabase.from("car_models").select("*").eq("car_model_status", "เปิดใช้งาน");
  if (error) {
    $toast.error(error.message);
  } else {
    car_models.value = response;
  }
};

const car_models = ref([]);
const car_model_filters = computed(() => {
  return car_models.value.filter((item) => item.car_brand_id == car_brand_id.value);
});
</script>
<style></style>
