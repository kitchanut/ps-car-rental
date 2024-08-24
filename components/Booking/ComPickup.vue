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
            ref="files"
            prepend-icon=""
            type="file"
            accept="image/*"
            append-inner-icon="mdi-image"
            density="compact"
            multiple
            outlined
            dense
            hide-details="auto"
            :rules="[
              (value) => !!value.length || 'กรุณาอัพโหลดรูปภาพ!',
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
      <v-row v-if="formData.booking" class="mt-5" no-gutters v-viewer>
        <v-col cols="4 px-1 mb-2" v-for="image in formData.booking.uploads" :key="image.id">
          <v-card style="height: 90px" variant="text">
            <v-img
              style="border-radius: 6px"
              height="100%"
              cover
              :src="$getImage(image.file_path)"
              :lazy-src="$getImage(image.file_path)"
            />
            <v-btn
              style="top: 0px; right: 0px; position: absolute; z-index: 2000"
              color="red"
              icon="mdi-delete"
              density="comfortable"
              size="small"
              variant="tonal"
              @click="
                dialogDelete = true;
                imageId = image.id;
              "
            >
            </v-btn>
          </v-card>
        </v-col>
        <v-col cols="4 px-1">
          <v-card variant="outlined" height="90" style="border: 1px solid #ddd">
            <ImageUpload
              :booking_id="props.booking_id"
              type="รับรถ"
              location="pickup"
              accept="image/*"
              :loading="loadingImage"
              @success="uploadSuccess()"
            />
          </v-card>
        </v-col>
      </v-row>

      <v-btn :loading="loading" class="mt-5" type="submit" color="primary" variant="tonal" size="large" block>
        บันทึก
      </v-btn>
    </v-form>

    <!-- <v-btn
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
    </v-btn> -->

    <DialogDelete :dialogDelete="dialogDelete" @cancleItem="dialogDelete = false" @deleteItem="deleteItem" />
  </div>
</template>
<script setup>
const props = defineProps({
  step: { type: String, default: null },
  booking_id: { type: Number, default: null },
  booking_status: String,
});

const { $toast } = useNuxtApp();
const emit = defineEmits(["success", "close"]);

// Common Variables
const loading = ref(false);
const form = ref(null);
const formData = ref({});
const actionType = ref("");
const loadingImage = ref(false);

onMounted(() => {
  getData();
});
const getData = async () => {
  loading.value = true;
  let query = props.booking_id ? `?booking_id=${props.booking_id}` : "";
  const response = await useApiBookingPickups().index(query);
  if (response.data.length) {
    actionType.value = "edit";
    formData.value = response.data[0];
    formData.value.pickup_date = useGlobalFunction().toDatetimeLocal(response.data[0].pickup_date);
  } else {
    actionType.value = "add";
    formData.value = {};
    form.value.reset();
  }
  loading.value = false;
};

// Upload Success
const uploadSuccess = () => {
  getData();
};

// Submit Data
const files = ref([]);
const onSubmit = async () => {
  const formValue = form.value;
  const validate = await formValue.validate();
  if (validate.valid) {
    loading.value = true;

    let response;
    if (actionType.value == "add") {
      let formDataNew = new FormData();
      formDataNew.append("pickup_date", formData.value.pickup_date);
      formData.value.pickup_note ? formDataNew.append("pickup_note", formData.value.pickup_note) : "";
      props.booking_id ? formDataNew.append("booking_id", Number(props.booking_id)) : "";
      formDataNew.append("location", "pickup");
      for (let i = 0; i < files.value.files.length; i++) {
        formDataNew.append("files", files.value.files[i]);
      }
      response = await useApiBookingPickups().store(formDataNew);
    } else {
      response = await useApiBookingPickups().update(formData.value.id, formData.value);
    }
    if (response.status == 200) {
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

const imageId = ref(0);
const dialogDelete = ref(false);
const deleteItem = async () => {
  dialogDelete.value = false;
  const response = await useApiUploads().destroy(imageId.value);
  response.status == 200 ? $toast.success("ลบสำเร็จ") : $toast.error("เกิดข้อผิดพลาด! กรุณาติดต่อผู้แลระบบ");
  getData();
};

watch(
  () => props.step,
  (newValue, oldValue) => {
    if (newValue == "3") {
      getData();
    }
  }
);
</script>
