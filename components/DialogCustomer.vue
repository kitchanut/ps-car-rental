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
        v-if="props.appearance == 'icon'"
        v-bind="activatorProps"
        icon="mdi-plus"
        color="primary"
        variant="text"
        density="comfortable"
        size="small"
      >
      </v-btn>
      <v-btn
        v-if="props.appearance == 'addAvatar'"
        v-bind="activatorProps"
        icon="mdi-account-plus"
        color="grey"
        variant="tonal"
        density="comfortable"
        class="mr-3"
      >
      </v-btn>
      <v-btn
        v-if="props.appearance == 'editAvatar'"
        v-bind="activatorProps"
        icon="mdi-account-edit"
        color="success"
        variant="tonal"
        density="comfortable"
        class="mr-3"
      >
      </v-btn>
      <v-btn
        v-if="props.appearance == 'inactivatAvatar'"
        v-bind="activatorProps"
        icon="mdi-account-remove"
        color="error"
        variant="tonal"
        density="comfortable"
        class="mr-3"
      >
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
        <v-progress-linear v-if="loading" color="yellow-darken-2" indeterminate></v-progress-linear>
        <v-container>
          <v-row no-gutters="">
            <v-col cols="4">
              <v-select
                :items="['ชาย', 'หญิง', 'ไม่ระบุ']"
                v-model="formData.customer_sex"
                density="comfortable"
                label="เพศ"
                hide-details
              ></v-select>
            </v-col>
            <v-col>
              <v-text-field
                class="pl-2"
                label="ชื่อลูกค้า"
                v-model="formData.customer_name"
                density="comfortable"
                outlined
                dense
                hide-details
                :rules="[(value) => !!value || 'Required.']"
              >
              </v-text-field>
            </v-col>
          </v-row>

          <v-text-field
            class="mt-3"
            label="ชื่อเล่น"
            v-model="formData.customer_nickname"
            density="comfortable"
            outlined
            dense
            hide-details
          >
          </v-text-field>

          <v-row class="mt-3" no-gutters>
            <v-col>
              <v-text-field
                class="pr-1"
                label="FB-ID"
                type="number"
                v-model="formData.facebook_id"
                density="comfortable"
                outlined
                dense
                hide-details
                readonly
              >
              </v-text-field>
            </v-col>
            <v-col>
              <v-text-field
                class="pl-1"
                label="Facebook Name"
                v-model="formData.facebook_name"
                density="comfortable"
                outlined
                dense
                hide-details
                readonly
              >
              </v-text-field>
            </v-col>
          </v-row>

          <v-row class="mt-3" no-gutters>
            <v-col>
              <v-text-field
                class="pr-1"
                label="เบอร์โทร"
                type="number"
                v-model="formData.customer_tel"
                density="comfortable"
                outlined
                dense
                hide-details
              >
              </v-text-field>
            </v-col>
            <v-col>
              <v-text-field
                class="pl-1"
                label="เบอร์โทรสำรอง"
                v-model="formData.customer_tel_backup"
                density="comfortable"
                outlined
                dense
                hide-details
              >
              </v-text-field>
            </v-col>
          </v-row>

          <v-row class="mt-3" no-gutters>
            <v-col cols="6">
              <v-text-field
                class="pr-1"
                label="เลขประจำตัวประชาชน"
                v-model="formData.customer_citizen_id"
                density="comfortable"
                outlined
                dense
                hide-details
              >
              </v-text-field>
            </v-col>
            <v-col>
              <v-text-field
                class="pl-1"
                label="วันหมดอายุ"
                v-model="formData.customer_citizen_expiry"
                type="date"
                density="comfortable"
                outlined
                dense
                hide-details
              >
              </v-text-field>
            </v-col>
          </v-row>

          <v-row class="mt-3" no-gutters>
            <v-col cols="6">
              <v-text-field
                class="pr-1"
                label="เลขที่ใบขับขี่"
                v-model="formData.customer_driver_license"
                density="comfortable"
                outlined
                dense
                hide-details
              >
              </v-text-field>
            </v-col>
            <v-col>
              <v-text-field
                class="pl-1"
                label="วันหมดอายุ"
                v-model="formData.customer_driver_license_expiry"
                type="date"
                density="comfortable"
                outlined
                dense
                hide-details
              >
              </v-text-field>
            </v-col>
          </v-row>

          <v-select
            class="mt-3"
            :items="['เปิดใช้งาน', 'ระงับการใช้งาน']"
            v-model="formData.customer_status"
            density="comfortable"
            label="สถานะ"
            hide-details
            :rules="[(value) => !!value || 'Required.']"
          ></v-select>

          <v-btn
            v-if="props.actionType == 'edit' && formData.customer_status == 'ระงับการใช้งาน'"
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

          <v-row class="mt-3" no-gutters v-viewer>
            <v-col lg="2" md="3" sm="3" cols="4" class="px-1 mb-2" v-for="image in images" :key="image.id">
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
                    dialogDeleteImage = true;
                    imageId = image.id;
                  "
                >
                </v-btn>
              </v-card>
            </v-col>
            <v-col lg="2" md="3" sm="3" cols="4" class="px-1">
              <v-card variant="outlined" height="90" style="border: 1px solid #ddd">
                <ImageUpload
                  :customer_id="props.id"
                  type="customers"
                  location="customers"
                  :loading="loadingImage"
                  @success="getImages()"
                />
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-form>
    </v-card>

    <DialogDelete :dialogDelete="dialogDelete" @cancleItem="dialogDelete = false" @deleteItem="deleteItem" />
    <DialogDelete :dialogDelete="dialogDeleteImage" @cancleItem="dialogDeleteImage = false" @deleteItem="deleteImage" />
  </v-dialog>
</template>

<script setup>
const props = defineProps({
  dialog: { type: Boolean, default: false },
  actionType: String,
  appearance: String,
  id: Number,
  facebook_id: String,
  facebook_name: String,
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
  const response = await useApiCustomers().show(props.id);
  formData.value = response.data;
  loading.value = false;
};

const images = ref([]);
const loadingImage = ref(false);
const getImages = async () => {
  loadingImage.value = true;
  const response = await useApiUploads().index(props.id, "customers");
  images.value = response.data;
  loadingImage.value = false;
};

const dialogDeleteImage = ref(false);
const imageId = ref(0);
const deleteImage = async () => {
  loading.value = true;
  dialogDeleteImage.value = false;
  const response = await useApiUploads().destroy(imageId.value);
  response.status == 200
    ? ($toast.success("ลบสำเร็จ"), getImages())
    : $toast.error("เกิดข้อผิดพลาด! กรุณาติดต่อผู้แลระบบ");
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
      const response = await useApiCustomers().store(formData.value);
      response.status == 201
        ? ($toast.success("ทำรายการสำเร็จ"), (dialog.value = false), emit("success"))
        : $toast.error("เกิดข้อผิดพลาด! กรุณาติดต่อผู้แลระบบ");
    } else {
      const response = await useApiCustomers().update(formData.value.id, formData.value);
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
  const response = await useApiCustomers().destroy(id.value);
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
        formData.value.facebook_id = props.facebook_id;
        formData.value.facebook_name = props.facebook_name;

        if (props.actionType == "add") {
          formTitle.value = "เพิ่มข้อมูล";
          formData.value.customer_status = "เปิดใช้งาน";
          loading.value = false;
        } else {
          formTitle.value = "แก้ไขข้อมูล";
          getData();
          getImages();
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

<style scoped></style>
