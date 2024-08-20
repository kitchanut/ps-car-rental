<template>
  <div>
    <v-form ref="form" lazy-validation @submit.prevent="onSubmit()">
      <v-row class="mt-3" no-gutters>
        <v-col cols="4" class="d-flex align-center">วันรับรถ</v-col>
        <v-col>
          <v-text-field
            class="pl-3"
            v-model="formData.pickup_date"
            type="datetime-local"
            density="compact"
            outlined
            dense
            hide-details
            :rules="[(value) => !!value || 'Required.']"
          >
          </v-text-field>
        </v-col>
      </v-row>

      <v-row v-if="actionType == 'add'" class="mt-3" no-gutters>
        <v-col cols="4" class="d-flex align-center">รูปภาพประกอบ</v-col>
        <v-col>
          <v-file-input
            class="pl-3 right-input"
            ref="file"
            prepend-icon=""
            type="file"
            accept="image/*"
            append-inner-icon="mdi-image"
            density="compact"
            outlined
            dense
            hide-details="auto"
            :rules="[
              (value) => value.length || 'กรุณาอัพโหลดรูปภาพ!',
              (value) => !value.length || value[0].size < 10000000 || 'รูปภาพต้องน้อยกว่า 10 MB!',
            ]"
          >
          </v-file-input>
        </v-col>
      </v-row>
      <v-row class="mt-3" no-gutters>
        <v-col cols="4" class="d-flex align-center">หมายเหตุ</v-col>
        <v-col>
          <v-textarea
            class="pl-3 right-input"
            rows="2"
            v-model="formData.pickup_note"
            density="compact"
            outlined
            dense
            hide-details
          >
          </v-textarea>
        </v-col>
      </v-row>
      <v-btn class="mt-5" type="submit" color="primary" variant="tonal" size="large" block> บันทึก </v-btn>
    </v-form>

    <v-btn
      v-if="actionType == 'edit'"
      class="mt-2"
      color="error"
      variant="tonal"
      size="large"
      block
      @click="
        dialogDelete = true;
        id = formData.id;
      "
    >
      ลบข้อมูล
    </v-btn>
  </div>
</template>
<script setup>
const props = defineProps({
  booking_id: { type: Number, default: null },
  booking_status: String,
});

const { $toast } = useNuxtApp();
const emit = defineEmits(["success", "close"]);

// Common Variables
const loading = ref(false);
const form = ref(null);
const formData = ref({});
const file = ref([]);
const actionType = ref("");

onMounted(() => {
  getData();
});
const getData = async () => {
  loading.value = true;
  let query = `?booking_id=${props.booking_id}`;
  const response = await useApiBookingPickups().index(query);
  console.log(response.data);
  if (response.data.length > 0) {
    console.log("edit");
    actionType.value = "edit";
    formData.value = response.data[0];
    formData.value.pickup_date = useGlobalFunction().toDatetimeLocal(response.data[0].pickup_date);
  } else {
    console.log("add");
    actionType.value = "add";
    formData.value = {};
    form.value.reset();
  }
  loading.value = false;
};

// Submit Data
const onSubmit = async () => {
  const formValue = form.value;
  const validate = await formValue.validate();
  if (validate.valid) {
    loading.value = true;
    let formDataNew = new FormData();
    formDataNew.append("pickup_date", formData.value.pickup_date);
    formDataNew.append("location", "pickup");
    formData.value.pickup_note ? formDataNew.append("pickup_note", formData.value.pickup_note) : "";

    let response;
    if (actionType.value == "add") {
      props.booking_id ? formDataNew.append("booking_id", Number(props.booking_id)) : "";
      formDataNew.append("file", file.value.files[0]);
      response = await useApiBookingPickups().store(formDataNew);
    } else {
      response = await useApiBookingPickups().update(props.id, formDataNew);
    }
    if (response.status == 201) {
      $toast.success("ทำรายการสำเร็จ");
      getData();
      if (props.booking_status == "มัดจำ") {
        let updateBooking = {
          booking_status: "รับรถ",
        };
        const response = await useApiBookings().update(props.booking_id, updateBooking);
        response.status == 200 ? emit("success") : $toast.error("เกิดข้อผิดพลาด! ในขั้นตอนอัพเดทสถานะ");
      }
    } else {
      $toast.error("เกิดข้อผิดพลาด! กรุณาติดต่อผู้แลระบบ");
    }
    loading.value = false;
  }
};
</script>
