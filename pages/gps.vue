<template>
  <div class="pa-3">
    <div id="MapReferIndex" style="height: 500px"></div>
    <v-row class="mt-1">
      <v-col v-for="item in data" :key="item.id" :cols="columnSize">
        <v-card
          class="text-center"
          variant="tonal"
          :color="item.branches.branch_color"
          @click="handleClick(item)"
          @dblclick="handleDblClick(item)"
        >
          <v-chip class="rounded-0" density="compact" size="small" style="position: absolute; top: 0px; right: 0px">
            {{ item.booking_number }}
          </v-chip>
          <v-card-text class="pa-1 pt-5">
            <div>{{ item.cars.car_models.car_model_name }}</div>
            <div>{{ item.cars.license_plate }}</div>
            <div>สาขา{{ item.branches.branch_name }}</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
  <DialogBooking :dialog="dialog" :id="id" actionType="edit" @success="getData()" @close="dialog = false" />
  <DialogBookingDetails :dialog="dialogBookingDetails" :id="id" @close="dialogBookingDetails = false" />
</template>
<script setup>
const supabase = useNuxtApp().$supabase;
const { $toast } = useNuxtApp();

import { useDisplay } from "vuetify";
const { name } = useDisplay();
const displaySize = computed(() => name.value);
const columnSize = computed(() => {
  if (displaySize.value == "xs") {
    return 6;
  } else if (displaySize.value == "sm") {
    return 4;
  } else {
    return 3;
  }
});

const user = ref(localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null);
const branch_id = ref(user.value.branch_id);

onMounted(() => {
  initMap();
  getData();
});
let map;
const initMap = () => {
  let lat = 17.400897878609207;
  let lng = 104.71154375603949;
  map = new longdo.Map({
    placeholder: document.getElementById("MapReferIndex"),
    // ui: longdo.UiComponent.Mobile,
  });
  map.location({ lon: lng, lat: lat }, true);
  map.zoom(12, true);
  map.Layers.setBase(longdo.Layers.NORMAL);
};

const loading = ref(true);
const data = ref([]);
const getData = async () => {
  loading.value = true;
  let query = supabase
    .from("bookings")
    .select("*,cars(*,car_models(*)),branches:bookings_branch_id_fkey(*)")
    .eq("booking_status", "รับรถ")
    .order("branch_id");
  if (branch_id.value != null) {
    query = query.eq("branch_id", branch_id.value);
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
</script>
