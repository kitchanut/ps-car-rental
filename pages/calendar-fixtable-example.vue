<template>
  <div>
    <div class="pa-2 d-flex">
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

    <v-divider></v-divider>
    <div class="outer" style="border-bottom: 1px solid #ccc">
      <div class="inner" :style="`width: ${innerWidth - 170}px;`">
        <v-table density="compact" style="line-height: 1.1">
          <thead>
            <tr>
              <th class="text-center fix" style="font-size: 1.1rem">
                <div style="padding-top: 10px">รายการรถ</div>
              </th>
              <th class="text-center header">
                {{ $dayjs().add(-2, "day").format("MMM D") }}
              </th>
              <th class="text-center">{{ $dayjs().add(-1, "day").format("MMM D") }}</th>
              <th class="text-center header" style="color: #1966c0; font-weight: 700">
                {{ $dayjs().format("MMM D") }}
              </th>
              <th class="text-center header" v-for="n in 100">{{ $dayjs().add(n, "day").format("MMM D") }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in filterData" style="height: 53px">
              <td class="fix" style="padding: 0px; height: 53px">
                <div class="d-flex">
                  <div
                    style="border-right: 1px solid #ccc; padding: 5px 5px; min-width: 75px; text-align: center"
                    @click="
                      dialog = true;
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
                  </div>
                  <div class="vertical-text px-1">{{ item.year }}</div>
                  <div class="text-center" style="border-left: 1px solid #ccc; padding: 5px 5px; width: 100%">
                    <div>
                      <b>{{ item.car_model.car_model_name }}</b>
                    </div>
                    <div style="color: green; font-size: 0.7rem">
                      <b>{{ item.rental_per_day.toLocaleString() }}</b>
                    </div>
                    <v-chip :color="item.color_code" label variant="flat" density="compact" size="x-small">
                      {{ item.color }}
                    </v-chip>
                    <v-btn
                      style="position: absolute; top: 15px; right: -10px"
                      size="small"
                      density="compact"
                      dark
                      :icon="drawer ? 'mdi-chevron-left' : 'mdi-chevron-right'"
                      @click="
                        drawer = !drawer;
                        id = item.id;
                      "
                    >
                    </v-btn>
                  </div>
                </div>
              </td>
              <td align="center"></td>
              <td align="center">
                <v-btn
                  color="warning"
                  variant="tonal"
                  density="compact"
                  style="min-width: 40px; height: 100%; padding: 0px"
                >
                  จอง
                </v-btn>
              </td>
              <td align="center"></td>
              <td align="center" v-for="n in 100"></td>
            </tr>
          </tbody>
        </v-table>
      </div>
    </div>
    <DialogBooking
      :dialog="dialogBooking"
      :id="id"
      actionType="edit"
      @success="getData()"
      @close="dialogBooking = false"
    />
    <DialogCar :dialog="dialogCar" :id="id" actionType="edit" @success="getData()" @close="dialogCar = false" />
    <DrawerFile :drawer="drawer" :id="id" type="car" @close="drawer = false" />
  </div>
</template>
<script setup>
const dayjs = useDayjs();
const innerWidth = ref(window.innerWidth);
const user = ref(useCookie("user").value);

const row1BarList = ref([
  {
    myBeginDate: "2024-08-17 09:00",
    myEndDate: "2024-08-18 09:00",
    ganttBarConfig: {
      // each bar must have a nested ganttBarConfig object ...
      id: "unique-id-1", // ... and a unique "id" property
      label: "LD1234",
    },
  },
]);
const row2BarList = ref([
  {
    myBeginDate: "2024-08-19 10:00",
    myEndDate: "2024-08-19 18:00",
    ganttBarConfig: {
      id: "another-unique-id-2",
      // hasHandles: true,
      // label: "MX3421",
      // style: {
      //   background: "#e09b69",
      //   borderRadius: "20px",
      //   color: "black",
      // },
    },
  },
]);

// Get Car
const loading = ref(true);
const data = ref([]);
const getData = async () => {
  loading.value = true;
  const response = await useApiCars().index();
  data.value = response.data;
  data.value.map((item, index) => {
    item.car_model_name = item.car_model.car_model_name;
    item.bookings.map((booking) => {
      booking.begin = dayjs(booking.pickup_date).format("YYYY-MM-DD HH:mm");
      booking.end = dayjs(booking.return_date).format("YYYY-MM-DD HH:mm");
      booking.ganttBarConfig = {
        id: booking.id,
        label: booking.booking_status,
        style: {
          fontSize: "0.8rem",
          background: "#FB8C00",
          borderRadius: "4px",
          color: "white",
        },
      };
    });
  });
  loading.value = false;
};
getData();

const filterData = computed(() => {
  return data.value.filter((item) => {
    return (
      (item.license_plate.toLowerCase().includes(search.value.toLowerCase()) ||
        item.car_model_name.toLowerCase().includes(search.value.toLowerCase())) &&
      (branch_id.value ? item.branch_id == branch_id.value : true) &&
      (car_type_id.value ? item.car_type_id == car_type_id.value : true) &&
      (car_brand_id.value ? item.car_brand_id == car_brand_id.value : true) &&
      (car_model_id.value ? item.car_model_id == car_model_id.value : true) &&
      item.rental_per_day <= price.value
    );
  });
});

// Additional Information
const id = ref(0);
const dialogBooking = ref(false);
const dialogCar = ref(false);
const drawer = ref(false);

// Click Bar
const onClickedBar = (item) => {
  dialogBooking.value = true;
  id.value = item.bar.id;
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
  const response = await useApiBranches().index();
  branches.value = response.data.filter((item) => item.branch_status == "เปิดใช้งาน");
};

const car_types = ref([]);
const getCarTypes = async () => {
  const response = await useApiCarTypes().index();
  car_types.value = response.data.filter((item) => item.car_type_status == "เปิดใช้งาน");
};

const car_brands = ref([]);
const getCarBrands = async () => {
  const response = await useApiCarBrands().index();
  car_brands.value = response.data.filter((item) => item.car_brand_status == "เปิดใช้งาน");
};

const getCarModels = async () => {
  const response = await useApiCarModels().index();
  car_models.value = response.data.filter((item) => item.car_model_status == "เปิดใช้งาน");
};

const car_models = ref([]);
const car_model_filters = computed(() => {
  return car_models.value.filter((item) => item.car_brand_id == car_brand_id.value);
});
</script>
<style scoped>
.header {
  width: 200px !important;
}

th {
  padding: 0px 5px !important;
  min-width: 40px !important;
}

td {
  padding: 0px !important;
}
.fix {
  position: absolute;
  margin-left: -170px;
  width: 170px;
  border-right: 1px solid #ccc;
}
.outer {
  position: relative;
}
.inner {
  overflow-x: scroll;
  overflow-y: visible;
  margin-left: 170px;
}
td + td {
  border-right: 1px solid #ccc;
}
th + th {
  border-right: 1px solid #ccc;
}
.border-right {
  border-right: 1px solid #ccc;
}
</style>
