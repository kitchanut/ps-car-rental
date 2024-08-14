<template>
  <v-dialog v-model="dialog" fullscreen :scrim="false" transition="dialog-bottom-transition">
    <template v-slot:activator="{ props: activatorProps }">
      <v-btn
        v-if="props.appearance == 'add'"
        class="ml-2"
        color="warning"
        dark
        v-bind="activatorProps"
        icon="mdi-plus"
        density="comfortable"
        size="small"
        variant="tonal"
        style="height: 28px; min-width: 28px; border-radius: 4px"
      >
      </v-btn>
      <v-btn
        v-if="props.appearance == 'square_pecil'"
        color="primary"
        dark
        v-bind="activatorProps"
        icon="mdi-pencil"
        density="comfortable"
        size="small"
        variant="tonal"
        style="height: 32px; min-width: 32px; padding: 0 10px; border-radius: 4px"
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
      <v-btn
        v-if="props.appearance == 'button_label'"
        class="mr-2"
        :color="props.status == 'เปิดใช้งาน' ? 'warning' : 'grey'"
        dark
        v-bind="activatorProps"
        density="comfortable"
        variant="tonal"
        style="min-width: 0px; padding: 0 8px"
      >
        <span v-if="props.status == 'เปิดใช้งาน'">{{ props.label }}</span>
        <s v-else>{{ props.label }}</s>
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
          <v-card :loading="loading" :disabled="loading" variant="outlined" style="border: thin solid #ddd !important">
            <v-card-text>
              <v-text-field
                label="รุ่นย่อย"
                append-icon=""
                v-model="formData.car_sub_model_name"
                density="comfortable"
                outlined
                dense
                hide-details
                :rules="[(value) => !!value || 'Required.']"
              >
              </v-text-field>

              <v-select
                class="mt-3"
                :items="['เปิดใช้งาน', 'ระงับการใช้งาน']"
                v-model="formData.car_sub_model_status"
                density="comfortable"
                label="สถานะ"
                hide-details
                :rules="[(value) => !!value || 'Required.']"
              ></v-select>
            </v-card-text>
          </v-card>

          <v-btn
            v-if="props.actionType == 'edit' && formData.car_sub_model_status == 'ระงับการใช้งาน'"
            class="mt-5"
            color="error"
            variant="tonal"
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

    <DialogDelete :dialogDelete="dialogDelete" @cancleItem="dialogDelete = false" @deleteItem="deleteItem" />
  </v-dialog>
</template>

<script setup>
const props = defineProps({
  dialog: { type: Boolean, default: false },
  car_model_id: Number,
  actionType: String,
  appearance: String,
  label: String,
  status: String,
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
  const response = await useApiCarSubModels().show(props.id);
  formData.value = response.data;
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
      const response = await useApiCarSubModels().store(formData.value);
      response.status == 201
        ? ($toast.success("ทำรายการสำเร็จ"), (dialog.value = false), emit("success"))
        : $toast.error("เกิดข้อผิดพลาด! กรุณาติดต่อผู้แลระบบ");
    } else {
      const response = await useApiCarSubModels().update(formData.value.id, formData.value);
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
  const response = await useApiCarSubModels().destroy(id.value);
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
          formData.value.car_model_id = props.car_model_id;
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

<style scoped></style>
