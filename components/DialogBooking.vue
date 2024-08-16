<template>
  <v-dialog v-model="dialog" fullscreen :scrim="false" transition="dialog-bottom-transition">
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
      <v-toolbar dark color="primary" density="comfortable">
        <v-container class="d-flex justify-space-between align-center">
          <v-toolbar-title style="flex: 4 1">{{ formTitle }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon dark @click="onClose()">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-container>
      </v-toolbar>

      <v-stepper v-model="step" class="mobile" hide-actions alt-labels>
        <v-stepper-header>
          <v-stepper-item
            title="จอง"
            value="1"
            editable
            :complete="props.actionType == 'edit' ? true : false"
            :color="props.actionType == 'edit' ? 'success' : ''"
          ></v-stepper-item>
          <v-divider></v-divider>
          <v-stepper-item title="มัดจำ" value="2" editable></v-stepper-item>
          <v-divider></v-divider>
          <v-stepper-item title="รับรถ" value="3" editable></v-stepper-item>
          <v-divider></v-divider>
          <v-stepper-item title="คืนรถ" value="4" editable></v-stepper-item>
          <v-divider></v-divider>
          <v-stepper-item title="คืนเงิน" value="5" editable></v-stepper-item>
        </v-stepper-header>
        <v-stepper-window>
          <v-stepper-window-item value="1">
            <v-form ref="form" lazy-validation @submit.prevent="onSubmit()">
              <v-row no-gutters>
                <v-col cols="4" class="d-flex align-center">ลูกค้า</v-col>
                <v-col>
                  <v-autocomplete
                    class="pl-3"
                    v-model="formData.customer_id"
                    :items="customers"
                    item-title="customer_name"
                    item-value="id"
                    density="compact"
                    hide-details
                    :rules="[(value) => !!value || 'Required.']"
                  >
                    <template v-slot:item="{ props, item }">
                      <v-list-item
                        v-bind="props"
                        :prepend-avatar="item.raw.customer_image ? $getImage(item.raw.customer_image) : $imageBaseApp()"
                        :title="item.raw.customer_name"
                        :subtitle="item.raw.customer_tel"
                      >
                      </v-list-item>
                    </template>
                  </v-autocomplete>
                </v-col>
              </v-row>

              <v-row class="mt-3" no-gutters>
                <v-col cols="4" class="d-flex align-center">รถ</v-col>
                <v-col>
                  <v-autocomplete
                    class="pl-3"
                    v-model="formData.car_id"
                    :items="cars"
                    item-title="license_plate"
                    item-value="id"
                    density="compact"
                    hide-details
                    :rules="[(value) => !!value || 'Required.']"
                  >
                    <template v-slot:item="{ props, item }">
                      <v-list-item
                        v-bind="props"
                        :prepend-avatar="
                          item.raw.uploads.length ? $getImage(item.raw.uploads[0].file_path) : $imageBaseApp()
                        "
                        :title="item.raw.license_plate"
                      >
                        <div class="d-flex" style="font-size: 0.875rem; color: grey">
                          {{ item.raw.car_model.car_model_name }} | {{ item.raw.year }} |
                          <b style="color: green" class="mx-1">{{ item.raw.rental_per_day.toLocaleString() }}</b> |

                          <v-chip :color="item.raw.color_code" label variant="flat" density="compact" size="small">
                            {{ item.raw.color }}
                          </v-chip>
                          |
                          <v-chip :color="item.raw.branch.branch_color" label density="compact" size="small">
                            {{ item.raw.branch.branch_name }}
                          </v-chip>
                        </div>
                      </v-list-item>
                    </template>
                  </v-autocomplete>
                </v-col>
              </v-row>

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

              <v-row class="mt-3" no-gutters>
                <v-col cols="4" class="d-flex align-center">วันคืนรถ</v-col>
                <v-col>
                  <v-text-field
                    class="pl-3"
                    v-model="formData.return_date"
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

              <v-row class="mt-3" no-gutters>
                <v-col cols="4" class="d-flex align-center">ค่าเช่า</v-col>
                <v-col>
                  <v-text-field
                    class="pl-3 right-input"
                    v-model.number="formData.rental_per_day"
                    type="number"
                    append-inner-icon="mdi-currency-thb"
                    density="compact"
                    outlined
                    dense
                    hide-details
                    :rules="[(value) => !isNaN(value) || 'Input must be a number']"
                  >
                  </v-text-field>
                </v-col>
              </v-row>

              <v-row class="mt-3" no-gutters>
                <v-col cols="4" class="d-flex align-center">ค่าคนขับ</v-col>
                <v-col>
                  <v-text-field
                    class="pl-3 right-input"
                    v-model.number="formData.driver_per_day"
                    type="number"
                    append-inner-icon="mdi-currency-thb"
                    density="compact"
                    outlined
                    dense
                    hide-details
                    :rules="[(value) => !isNaN(value) || 'Input must be a number']"
                  >
                  </v-text-field>
                </v-col>
              </v-row>

              <v-row class="mt-3" no-gutters>
                <v-col cols="4" class="d-flex align-center">ค่าเช่าเพิ่มเติม</v-col>
                <v-col>
                  <v-text-field
                    class="pl-3 right-input"
                    v-model.number="formData.extra_charge"
                    type="number"
                    append-inner-icon="mdi-currency-thb"
                    density="compact"
                    outlined
                    dense
                    hide-details
                    :rules="[(value) => !isNaN(value) || 'Input must be a number']"
                  >
                  </v-text-field>
                </v-col>
              </v-row>

              <v-row class="mt-3" no-gutters>
                <v-col cols="4" class="d-flex align-center">ส่วนลด</v-col>
                <v-col>
                  <v-text-field
                    class="pl-3 right-input"
                    v-model.number="formData.discount"
                    type="number"
                    append-inner-icon="mdi-currency-thb"
                    density="compact"
                    outlined
                    dense
                    hide-details
                    :rules="[(value) => !isNaN(value) || 'Input must be a number']"
                  >
                  </v-text-field>
                </v-col>
              </v-row>

              <v-row class="mt-3" no-gutters>
                <v-col cols="4" class="d-flex align-center">รวมหลังหักส่วนลด</v-col>
                <v-col>
                  <v-text-field
                    class="pl-3 right-input"
                    v-model.number="formData.sub_total"
                    type="number"
                    append-inner-icon="mdi-currency-thb"
                    density="compact"
                    outlined
                    dense
                    hide-details
                    :rules="[(value) => !isNaN(value) || 'Input must be a number']"
                  >
                  </v-text-field>
                </v-col>
              </v-row>

              <v-row class="mt-3" no-gutters>
                <v-col cols="4" class="d-flex align-center">% Vat</v-col>
                <v-col cols="3">
                  <v-select
                    class="pl-3"
                    :items="[0, 7]"
                    v-model.number="formData.vat_percent"
                    density="compact"
                    suffix="%"
                    menu-icon=""
                    :reverse="false"
                    hide-details
                    :rules="[(value) => !isNaN(value) || 'Input must be a number']"
                  ></v-select>
                </v-col>
                <v-col>
                  <v-text-field
                    class="pl-3 right-input"
                    v-model.number="formData.vat_amount"
                    type="number"
                    append-inner-icon="mdi-currency-thb"
                    density="compact"
                    outlined
                    dense
                    hide-details
                    :rules="[(value) => !isNaN(value) || 'Input must be a number']"
                  >
                  </v-text-field>
                </v-col>
              </v-row>

              <v-row class="mt-3" no-gutters>
                <v-col cols="4" class="d-flex align-center">รวม</v-col>
                <v-col>
                  <v-text-field
                    class="pl-3 right-input"
                    v-model.number="formData.total"
                    type="number"
                    append-inner-icon="mdi-currency-thb"
                    density="compact"
                    outlined
                    dense
                    hide-details
                    :rules="[(value) => !isNaN(value) || 'Input must be a number']"
                  >
                  </v-text-field>
                </v-col>
              </v-row>

              <v-row class="mt-3" no-gutters>
                <v-col cols="4" class="d-flex align-center">มัดจำ</v-col>
                <v-col>
                  <v-text-field
                    class="pl-3 right-input"
                    v-model.number="formData.deposit"
                    type="number"
                    append-inner-icon="mdi-currency-thb"
                    density="compact"
                    outlined
                    dense
                    hide-details
                    :rules="[(value) => !isNaN(value) || 'Input must be a number']"
                  >
                  </v-text-field>
                </v-col>
              </v-row>

              <v-row class="mt-3" no-gutters>
                <v-col cols="4" class="d-flex align-center">รวมสุทธิ</v-col>
                <v-col>
                  <v-text-field
                    class="pl-3 right-input"
                    v-model.number="formData.net_total"
                    type="number"
                    append-inner-icon="mdi-currency-thb"
                    density="compact"
                    outlined
                    dense
                    hide-details
                    :rules="[(value) => !isNaN(value) || 'Input must be a number']"
                  >
                  </v-text-field>
                </v-col>
              </v-row>

              <v-btn
                v-if="props.actionType == 'edit' && formData.booking_status == 'ระงับการใช้งาน'"
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

              <v-btn class="mt-5 mb-5" type="submit" color="primary" block size="large" variant="tonal"> บันทึก </v-btn>
            </v-form>
          </v-stepper-window-item>
          <v-stepper-window-item value="2"> </v-stepper-window-item>
        </v-stepper-window>
      </v-stepper>
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
const step = ref("1");
const dialog = ref(false);
const loading = ref(true);
const formData = ref({});
const formTitle = ref("");

onMounted(() => {
  getCars();
  getCarTypes();
});

const cars = ref([]);
const getCars = async () => {
  const response = await useApiCars().index();
  cars.value = response.data.filter((item) => item.car_status == "เปิดใช้งาน");
};

const customers = ref([]);
const getCarTypes = async () => {
  const response = await useApiCustomers().index();
  customers.value = response.data.filter((item) => item.customer_status == "เปิดใช้งาน");
};

// Get Data
const getData = async () => {
  loading.value = true;
  const response = await useApiBookings().show(props.id);
  formData.value = response.data;
  formData.value.pickup_date = useGlobalFunction().toDatetimeLocal(response.data.pickup_date);
  formData.value.return_date = useGlobalFunction().toDatetimeLocal(response.data.return_date);
  formTitle.value = "Booking No : " + response.data.booking_number;
  if (formData.value.booking_status == "จอง") {
    step.value = "2";
  } else if (formData.value.booking_status == "มัดจำ") {
    step.value = "3";
  } else if (formData.value.booking_status == "รับรถ") {
    step.value = "4";
  } else if (formData.value.booking_status == "คืนรถ") {
    step.value = "5";
  } else if (formData.value.booking_status == "คืนเงิน") {
    step.value = "5";
  }
  loading.value = false;
};

// Submit Data
const form = ref(null);
const onSubmit = async () => {
  const formValue = form.value;
  const validate = await formValue.validate();
  if (validate.valid) {
    loading.value = true;
    if (props.actionType == "add") {
      const response = await useApiBookings().store(formData.value);
      response.status == 201
        ? ($toast.success("ทำรายการสำเร็จ"), (dialog.value = false), emit("success"))
        : $toast.error("เกิดข้อผิดพลาด! กรุณาติดต่อผู้แลระบบ");
    } else {
      const response = await useApiBookings().update(formData.value.id, formData.value);
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
  const response = await useApiBookings().destroy(id.value);
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
    });
    if (props.actionType == "add") {
      formTitle.value = "เพิ่มข้อมูล";
      loading.value = false;
    } else {
      formTitle.value = "แก้ไขข้อมูล";
      getData();
    }
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
