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
          <v-text-field
            label="ชื่อสาขา"
            append-icon=""
            v-model="formData.branch_name"
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
            v-model="formData.branch_status"
            density="comfortable"
            label="สถานะ"
            hide-details
            :rules="[(value) => !!value || 'Required.']"
          ></v-select>

          <!-- <v-color-picker
            class="mt-3"
            width="100%"
            hide-inputs
            hide-sliders
            swatches-max-height
            v-model="formData.branch_color"
            show-swatches
          ></v-color-picker> -->

          <v-row class="mt-3" no-gutters>
            <v-col>
              <v-text-field
                label="สีประจำสาขา"
                v-model="formData.branch_color"
                density="comfortable"
                hide-details
                readonly
                :rules="[(value) => !!value || 'Required.']"
              ></v-text-field>
            </v-col>
            <v-col cols="4">
              <v-menu width="100%">
                <template v-slot:activator="{ props }">
                  <v-btn :color="formData.branch_color" v-bind="props" block style="height: 100%">
                    <span v-if="formData.branch_color">{{ formData.branch_color }}</span>
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
                    v-model="formData.branch_color"
                    show-swatches
                  ></v-color-picker>
                </v-card>
              </v-menu>
            </v-col>
          </v-row>

          <v-btn
            v-if="props.actionType == 'edit' && formData.branch_status == 'ระงับการใช้งาน'"
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
  const response = await useApiBranches().show(props.id);
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
      const response = await useApiBranches().store(formData.value);
      response.status == 201
        ? ($toast.success("ทำรายการสำเร็จ"), (dialog.value = false), emit("success"))
        : $toast.error("เกิดข้อผิดพลาด! กรุณาติดต่อผู้แลระบบ");
    } else {
      const response = await useApiBranches().update(formData.value.id, formData.value);
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
  const response = await useApiBranches().destroy(id.value);
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

<style scoped></style>
