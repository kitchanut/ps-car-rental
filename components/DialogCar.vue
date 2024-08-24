<template>
  <v-dialog v-model="dialog" fullscreen>
    <template v-slot:activator="{ props: activatorProps }">
      <v-btn
        v-if="props.appearance == 'add'"
        v-bind="activatorProps"
        color="primary"
        dark
        variant="tonal"
        style="height: 41px; min-width: 41px; padding: 0 10px"
      >
        <span style="font-size: 24px">+</span>
      </v-btn>
      <v-btn
        v-if="props.appearance == 'edit'"
        color="primary"
        dark
        v-bind="activatorProps"
        icon="mdi-pencil"
        density="comfortable"
        size="small"
        variant="tonal"
      >
      </v-btn>
    </template>
    <v-card>
      <v-form ref="form" lazy-validation @submit.prevent="onSubmit()">
        <v-toolbar dark color="primary" density="comfortable">
          <v-container class="d-flex justify-space-between align-center">
            <v-btn icon dark @click="onClose()">
              <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-toolbar-title>{{ formTitle }}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn variant="text" style="font-size: 1.25rem" type="submit"> บันทึก </v-btn>
          </v-container>
        </v-toolbar>
        <v-container>
          <v-row class="mt-3" no-gutters>
            <v-col cols="4" class="d-flex align-center">สาขา</v-col>
            <v-col>
              <v-select
                :items="branches"
                item-title="branch_name"
                item-value="id"
                v-model="formData.branch_id"
                density="compact"
                hide-details
                :rules="[(value) => !!value || 'Required.']"
              ></v-select>
            </v-col>
          </v-row>
          <v-row class="mt-3" no-gutters>
            <v-col cols="4" class="d-flex align-center">ประเภทรถ</v-col>
            <v-col>
              <v-select
                :items="car_types"
                item-title="car_type_name"
                item-value="id"
                v-model="formData.car_type_id"
                density="compact"
                hide-details
                :rules="[(value) => !!value || 'Required.']"
              ></v-select>
            </v-col>
          </v-row>
          <v-row class="mt-1" no-gutters>
            <v-col cols="4" class="d-flex align-center">ยี่ห้อรถ</v-col>
            <v-col>
              <v-select
                :items="car_brands"
                item-title="car_brand_name"
                item-value="id"
                v-model="formData.car_brand_id"
                density="compact"
                hide-details
                :rules="[(value) => !!value || 'Required.']"
              ></v-select>
            </v-col>
          </v-row>
          <v-row class="mt-1" no-gutters>
            <v-col cols="4" class="d-flex align-center">รุ่นรถ</v-col>
            <v-col>
              <v-select
                :items="car_model_filters"
                item-title="car_model_name"
                item-value="id"
                v-model="formData.car_model_id"
                density="compact"
                hide-details
                :rules="[(value) => !!value || 'Required.']"
              ></v-select>
            </v-col>
          </v-row>
          <v-row class="mt-1" no-gutters>
            <v-col cols="4" class="d-flex align-center">รุ่นย่อย</v-col>
            <v-col>
              <v-select
                :items="car_sub_model_filters"
                item-title="car_sub_model_name"
                item-value="id"
                v-model="formData.car_sub_model_id"
                density="compact"
                hide-details
              ></v-select>
            </v-col>
          </v-row>
          <v-row class="mt-1" no-gutters>
            <v-col cols="4" class="d-flex align-center">ปี</v-col>
            <v-col>
              <v-select
                :items="years"
                v-model="formData.year"
                density="compact"
                hide-details
                :rules="[(value) => !!value || 'Required.']"
              ></v-select>
            </v-col>
          </v-row>
          <v-row class="mt-1" no-gutters>
            <v-col cols="4" class="d-flex align-center">สี</v-col>
            <v-col>
              <v-text-field
                v-model="formData.color"
                density="compact"
                hide-details
                :rules="[(value) => !!value || 'Required.']"
              ></v-text-field>
            </v-col>
            <v-col cols="4">
              <v-menu width="100%">
                <template v-slot:activator="{ props }">
                  <v-btn :color="formData.color_code" v-bind="props" block style="height: 100%">
                    <span v-if="formData.color_code">{{ formData.color_code }}</span>
                    <span v-else>คลิกเพื่อเลือกสี</span>
                  </v-btn>
                </template>
                <v-card>
                  <v-toolbar color="white" density="comfortable">
                    <v-container class="d-flex justify-space-between align-center">
                      <v-btn icon dark>
                        <v-icon>mdi-close</v-icon>
                      </v-btn>
                      <v-toolbar-title>ปิด</v-toolbar-title>
                      <v-spacer></v-spacer>
                    </v-container>
                  </v-toolbar>
                  <v-color-picker
                    width="100%"
                    hide-inputs
                    hide-sliders
                    swatches-max-height
                    v-model="formData.color_code"
                    show-swatches
                  ></v-color-picker>
                </v-card>
              </v-menu>
            </v-col>
          </v-row>
          <v-row class="mt-3" no-gutters>
            <v-col cols="4" class="d-flex align-center">ทะเบียนรถ</v-col>
            <v-col>
              <v-text-field
                v-model="formData.license_plate"
                density="compact"
                hide-details
                :rules="[(value) => !!value || 'Required.']"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row class="mt-1" no-gutters>
            <v-col cols="4" class="d-flex align-center">จังหวัด</v-col>
            <v-col>
              <v-text-field
                v-model="formData.license_plate_province"
                density="compact"
                hide-details
                :rules="[(value) => !!value || 'Required.']"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row class="mt-3" no-gutters>
            <v-col cols="4" class="d-flex align-center">ค่าเช่าต่อวัน</v-col>
            <v-col>
              <v-text-field
                class="right-input"
                v-model.number="formData.rental_per_day"
                type="number"
                append-inner-icon="mdi-currency-thb"
                density="compact"
                hide-details
                :rules="[(value) => !isNaN(parseFloat(value)) || 'Must be a number']"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row class="mt-1" no-gutters>
            <v-col cols="4" class="d-flex align-center">ค่าคนขับต่อวัน</v-col>
            <v-col>
              <v-text-field
                class="right-input"
                v-model.number="formData.driver_per_day"
                type="number"
                append-inner-icon="mdi-currency-thb"
                density="compact"
                hide-details
                :rules="[(value) => !isNaN(parseFloat(value)) || 'Must be a number']"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row class="mt-1" no-gutters>
            <v-col cols="4" class="d-flex align-center">ค่ามัดจำ</v-col>
            <v-col>
              <v-text-field
                class="right-input"
                v-model.number="formData.deposit"
                type="number"
                append-inner-icon="mdi-currency-thb"
                density="compact"
                hide-details
                :rules="[(value) => !isNaN(parseFloat(value)) || 'Must be a number']"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row class="mt-1" no-gutters>
            <v-col cols="4" class="d-flex align-center">คืนรถเกินฟรี</v-col>
            <v-col>
              <v-text-field
                v-model.number="formData.excess_houre_free"
                type="number"
                suffix="ชั่วโมง"
                density="compact"
                hide-details
                :rules="[(value) => !isNaN(parseFloat(value)) || 'Must be a number']"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row class="mt-1" no-gutters>
            <v-col cols="4" class="d-flex align-center">คืนรถมีค่าปรับ</v-col>
            <v-col>
              <v-text-field
                v-model.number="formData.excess_houre_charge"
                type="number"
                suffix="ชั่วโมง"
                density="compact"
                hide-details
                :rules="[(value) => !isNaN(parseFloat(value)) || 'Must be a number']"
              ></v-text-field>
            </v-col>
            <v-col>
              <v-text-field
                class="pl-1"
                v-model.number="formData.excess_price"
                type="number"
                suffix="บาท"
                density="compact"
                hide-details
                :rules="[(value) => !isNaN(parseFloat(value)) || 'Must be a number']"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row class="mt-3" no-gutters>
            <v-col cols="4" class="d-flex align-center">สถานะ</v-col>
            <v-col>
              <v-select
                :items="['เปิดใช้งาน', 'ระงับการใช้งาน']"
                v-model="formData.car_status"
                density="compact"
                hide-details
                :rules="[(value) => !!value || 'Required.']"
              ></v-select>
            </v-col>
          </v-row>

          <v-btn
            v-if="props.actionType == 'edit' && formData.car_status == 'ระงับการใช้งาน'"
            class="mt-5"
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
        </v-container>
      </v-form>
    </v-card>

    <!-- <DialogLoader :loading="loading" /> -->
    <DialogDelete :dialogDelete="dialogDelete" @cancleItem="dialogDelete = false" @deleteItem="deleteItem" />
  </v-dialog>
</template>

<script setup>
const props = defineProps({
  dialog: { type: Boolean, default: false },
  actionType: String,
  appearance: String,
  id: Number,
});
const { $toast } = useNuxtApp();
const emit = defineEmits(["success", "close"]);

//Set common variable
const dialog = ref(false);
const loading = ref(true);
const formData = ref({});
const formTitle = ref("");

// Get Data
const getData = async () => {
  loading.value = true;
  const response = await useApiCars().show(props.id);
  formData.value = response.data;
  loading.value = false;
};

onMounted(() => {
  getBranches();
  getCarTypes();
  getCarBrands();
  getCarModels();
  getCarSubModels();
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

const car_models = ref([]);
const car_model_filters = computed(() => {
  return car_models.value.filter((item) => item.car_brand_id == formData.value.car_brand_id);
});
const getCarModels = async () => {
  const response = await useApiCarModels().index();
  car_models.value = response.data.filter((item) => item.car_model_status == "เปิดใช้งาน");
};

const car_sub_models = ref([]);
const car_sub_model_filters = computed(() => {
  return car_sub_models.value.filter((item) => item.car_model_id == formData.value.car_model_id);
});
const getCarSubModels = async () => {
  const response = await useApiCarSubModels().index();
  car_sub_models.value = response.data.filter((item) => item.car_sub_model_status == "เปิดใช้งาน");
};

// Set years from current year to 20 years ago
const years = ref([]);
const currentYear = new Date().getFullYear();
for (let i = currentYear; i >= currentYear - 20; i--) {
  years.value.push(i);
}
// Submit Data
const form = ref(null);
const onSubmit = async () => {
  const formValue = form.value;
  const validate = await formValue.validate();
  if (validate.valid) {
    loading.value = true;
    if (props.actionType == "add") {
      const response = await useApiCars().store(formData.value);
      response.status == 201
        ? ($toast.success("ทำรายการสำเร็จ"), (dialog.value = false), emit("success"))
        : $toast.error("เกิดข้อผิดพลาด! กรุณาติดต่อผู้แลระบบ");
    } else {
      const response = await useApiCars().update(formData.value.id, formData.value);
      response.status == 200
        ? ($toast.success("แก้ไขข้อมูลสำเร็จ"), (dialog.value = false), emit("success"))
        : $toast.error("เกิดข้อผิดพลาด! กรุณาติดต่อผู้แลระบบ");
    }
    loading.value = false;
  }
};

const id = ref(0);
const dialogDelete = ref(false);
const deleteItem = async () => {
  loading.value = true;
  dialogDelete.value = false;
  const response = await useApiCars().destroy(id.value);
  response.status == 200
    ? ($toast.success("ลบสำเร็จ"), (dialog.value = false), emit("success"))
    : $toast.error("เกิดข้อผิดพลาด! กรุณาติดต่อผู้แลระบบ");
  loading.value = false;
};

const onClose = () => {
  dialog.value = false;
  emit("close");
};

// Check dialog isOpen
watch(dialog, (value) => {
  if (value) {
    nextTick(() => {
      formData.value = {};
      form.value.reset();
      nextTick(() => {
        if (props.actionType == "add") {
          formTitle.value = "เพิ่มข้อมูล";
          loading.value = false;
        } else {
          formTitle.value = "แก้ไขข้อมูล";
          getData();
        }
      });
    });
  } else {
    onClose();
  }
});

watch(
  () => props.dialog,
  (value) => {
    dialog.value = value;
  }
);
</script>

<style scoped>
.right-input :deep() input {
  text-align: right;
}
</style>
