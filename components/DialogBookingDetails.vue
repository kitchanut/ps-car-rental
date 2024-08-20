<template>
  <v-dialog v-model="dialog" persistent fullscreen>
    <!-- <template v-slot:activator="{ props: activatorProps }"> </template> -->
    <v-card>
      <v-toolbar dark color="primary" density="comfortable">
        <v-container class="d-flex justify-space-between align-center">
          <v-toolbar-title style="flex: 4 1">Booking No: {{ item.booking_number }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon dark @click="onClose()">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-container>
      </v-toolbar>
      <v-container v-if="loading" style="height: 70vh">
        <v-row align-content="center" class="fill-height" justify="center">
          <v-col class="text-subtitle-1 text-center" cols="12"> กรุณารอสักครู่ </v-col>
          <v-col cols="6">
            <v-progress-linear color="primary" height="6" indeterminate rounded></v-progress-linear>
          </v-col>
        </v-row>
      </v-container>
      <v-container v-else>
        {{ item }}
      </v-container>
    </v-card>
  </v-dialog>
</template>
<script setup>
const props = defineProps({
  dialog: { type: Boolean, default: false },
  id: Number,
});
const emit = defineEmits(["success", "close"]);

//Set common variable
const dialog = ref(false);
const loading = ref(false);

const item = ref({});
const getData = async () => {
  loading.value = true;
  const response = await useApiBookings().show(props.id);
  item.value = response.data;
  loading.value = false;
};

const onClose = () => {
  dialog.value = false;
  emit("close");
};

// Check dialog isOpen
watch(dialog, (value) => {
  if (value) {
    getData();
  }
});

watch(
  () => props.dialog,
  (value) => {
    dialog.value = value;
  }
);
</script>
