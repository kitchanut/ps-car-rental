<template>
  <v-dialog v-model="dialog" fullscreen :scrim="false" transition="dialog-bottom-transition">
    <template v-slot:activator="{ props }">
      <v-btn
        v-if="myProps.actionType == 'add'"
        v-bind="props"
        class="ml-2"
        color="primary"
        dark
        variant="tonal"
        style="height: 50px; min-width: 36px; padding: 0 20px"
      >
        <span style="font-size: 24px">+</span>
      </v-btn>
      <v-btn
        v-if="myProps.actionType == 'edit'"
        color="primary"
        dark
        v-bind="props"
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
            <v-btn icon dark @click="dialog = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-toolbar-title>{{ formTitle }}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn variant="text" style="font-size: 1.25rem" type="submit"> บันทึก </v-btn>
          </v-container>
        </v-toolbar>
        <v-container>
          <v-card variant="outlined" style="border: thin solid #ddd !important">
            <v-card-text>
              <v-text-field
                label="ชื่อ-สกุล"
                append-icon=""
                v-model="formData.name"
                density="comfortable"
                outlined
                dense
                hide-details
                :rules="[(value) => !!value || 'Required.']"
              >
              </v-text-field>

              <v-text-field
                class="mt-3"
                label="Email/Username"
                v-model="formData.email"
                density="comfortable"
                outlined
                dense
                hide-details
                :rules="[(value) => !!value || 'Required.']"
              >
              </v-text-field>

              <v-text-field
                class="mt-3"
                label="Password"
                v-model="formData.password"
                density="comfortable"
                outlined
                dense
                hide-details
                :rules="rulePassword"
              >
              </v-text-field>

              <v-select
                class="mt-3"
                :items="['เปิดใช้งาน', 'ระงับการใช้งาน']"
                v-model="formData.status"
                density="comfortable"
                label="สถานะ"
                hide-details
                :rules="[(value) => !!value || 'Required.']"
              ></v-select>
            </v-card-text>
          </v-card>
        </v-container>
      </v-form>
    </v-card>

    <DialogLoader :loading="loading" />
  </v-dialog>
</template>

<script setup>
const myProps = defineProps({
  actionType: String,
  id: Number,
});
const { $toast } = useNuxtApp();
const emit = defineEmits(["success"]);

//Set common variable
const dialog = ref(false);
const loading = ref(true);
const formData = ref({});
const formTitle = ref("");
const rulePassword = ref([]);
const permissions = ref([]);
// Get Data
const getData = async () => {
  loading.value = true;
  const response = await useApiUsers().show(myProps.id);
  formData.value = response.data;
  loading.value = false;
};

// Get Data
// const getPagePermission = async () => {
//   const response = await useApiPages().eachUser(myProps.id);
//   permissions.value = response.data;
// };

// Check dialog isOpen
watch(dialog, (value) => {
  if (value) {
    // getPagePermission();
    nextTick(() => {
      formData.value = {};
      form.value.reset();
    });
    if (myProps.actionType == "add") {
      loading.value = false;
      formData.status = "เปิดใช้งาน";
      formTitle.value = "เพิ่มข้อมูล";
      rulePassword.value = [(value) => !!value];
    } else {
      formTitle.value = "แก้ไขข้อมูล";
      getData();
    }
  }
});

// Submit Data
const form = ref(null);
const onSubmit = async () => {
  const formValue = form.value;
  const validate = await formValue.validate();
  if (validate.valid) {
    loading.value = true;
    // formData.value.permissions = permissions.value;
    if (myProps.actionType == "add") {
      const response = await useApiUsers().store(formData.value);
      response.status == 201
        ? ($toast.success("ทำรายการสำเร็จ"), (dialog.value = false), emit("success"))
        : $toast.error("เกิดข้อผิดพลาด! กรุณาติดต่อผู้แลระบบ");
    } else {
      const response = await useApiUsers().update(formData.value.id, formData.value);
      response.status == 200
        ? ($toast.success("แก้ไขข้อมูลสำเร็จ"), (dialog.value = false), emit("success"))
        : $toast.error("เกิดข้อผิดพลาด! กรุณาติดต่อผู้แลระบบ");
    }
    loading.value = false;
  }
};
</script>

<style scoped></style>
