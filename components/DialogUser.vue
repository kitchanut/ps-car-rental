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
            <v-btn icon dark @click="dialog = false">
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
                label="Email"
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
                :items="['ผู้ใช้งานทั่วไป', 'แอดมิน', 'ผู้บริหาร']"
                v-model="formData.level"
                density="comfortable"
                label="ระดับ"
                hide-details
                :rules="[(value) => !!value || 'Required.']"
              ></v-select>

              <v-select
                class="mt-3"
                :items="branches"
                item-title="branch_name"
                item-value="id"
                v-model="formData.branch_id"
                density="comfortable"
                label="ประจำสาขา"
                hide-details
              ></v-select>

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

          <v-btn
            v-if="props.actionType == 'edit' && formData.status == 'ระงับการใช้งาน'"
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
  id: String,
});
const supabase = useNuxtApp().$supabase;
const { $toast } = useNuxtApp();
const emit = defineEmits(["success", "close"]);

//Set common variable
const dialog = ref(false);
const loading = ref(true);
const formData = ref({});
const formTitle = ref("");
const rulePassword = ref([]);

// Get Data
const getData = async () => {
  loading.value = true;
  const { data: user, error } = await supabase.from("users").select("*").eq("id", props.id).single();
  if (error) {
    $toast.error(error.message);
  } else {
    delete user.password;
    formData.value = user;
  }
  loading.value = false;
};

// Get Branch
const branches = ref([]);
const getBranch = async () => {
  const { data: branch, error } = await supabase
    .from("branches")
    .select("*")
    .order("id")
    .eq("branch_status", "เปิดใช้งาน");
  if (error) {
    $toast.error(error.message);
  } else {
    branches.value = branch;
  }
  branches.value.unshift({
    id: null,
    branch_name: "ส่วนกลาง",
  });
};
getBranch();

// Submit Data
const form = ref(null);
const onSubmit = async () => {
  const formValue = form.value;
  const validate = await formValue.validate();
  if (validate.valid) {
    loading.value = true;

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (props.actionType == "add") {
      // const response = await useApiUsers().store(formData.value);
      const response = await $fetch("/api/users/create", {
        method: "POST",
        headers: { Authorization: "Bearer " + session.access_token },
        body: {
          email: formData.value.email,
          password: formData.value.password,
          user_metadata: { role: formData.value.level },
        },
      });
      if (response.status != 200) {
        $toast.error(response.error);
        loading.value = false;
        return;
      }
      delete formData.value.password;
      formData.value.id = response.data.user.id;

      const { data, error } = await supabase.from("users").insert(formData.value).select();
      if (error) {
        $toast.error(error.message);
      } else {
        $toast.success("บันทึกข้อมูลสำเร็จ");
        emit("success");
        dialog.value = false;
      }
    } else {
      // const response = await useApiUsers().update(formData.value.id, formData.value);
      // response.status == 200
      //   ? ($toast.success("แก้ไขข้อมูลสำเร็จ"), (dialog.value = false), emit("success"))
      //   : $toast.error("เกิดข้อผิดพลาด! กรุณาติดต่อผู้แลระบบ");

      const response = await $fetch("/api/users/update", {
        method: "POST",
        headers: { Authorization: "Bearer " + session.access_token },
        body: {
          userId: formData.value.id,
          newEmail: formData.value.email,
          newPassword: formData.value.password,
        },
      });

      if (formData.value.password) {
        delete formData.value.password;
      }

      const { data, error } = await supabase.from("users").update(formData.value).eq("id", props.id);
      error
        ? $toast.error(error.message)
        : ($toast.success("บันทึกข้อมูลสำเร็จ"), emit("success"), (dialog.value = false));
    }
  }
  loading.value = false;
};

const id = ref(0);
const dialogDelete = ref(false);
const deleteItem = async () => {
  loading.value = true;
  dialogDelete.value = false;
  const response = await useApiUsers().destroy(id.value);
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
    // getPagePermission();
    nextTick(() => {
      formData.value = {};
      form.value.reset();
    });
    if (props.actionType == "add") {
      loading.value = false;
      formData.status = "เปิดใช้งาน";
      formTitle.value = "เพิ่มข้อมูล";
      rulePassword.value = [(value) => !!value];
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
