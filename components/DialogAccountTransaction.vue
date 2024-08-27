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
        v-if="props.appearance == 'addFullWidthDeposit'"
        v-bind="activatorProps"
        color="primary"
        dark
        variant="tonal"
        block
        size="x-large"
      >
        <span><b>+</b><span> รับเงินมัดจำ</span></span>
        <div></div>
      </v-btn>
      <v-btn
        v-if="props.appearance == 'addFullWidthRefund'"
        v-bind="activatorProps"
        color="warning"
        dark
        variant="tonal"
        block
        size="x-large"
      >
        <span><span> คืนเงินมัดจำ</span></span>
        <div></div>
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
            <v-btn variant="text" style="font-size: 1.25rem" type="submit" :loading="loading"> บันทึก </v-btn>
          </v-container>
        </v-toolbar>
        <v-container>
          <v-row class="mt-3" no-gutters>
            <v-col cols="4" class="d-flex align-center">ประเภท</v-col>
            <v-col class="pl-3">
              <v-btn-toggle
                v-model="formData.type"
                :color="formData.type == 'deposit' ? 'success' : 'warning'"
                variant="outlined"
                divided
                density="comfortable"
                style="width: 100%"
              >
                <v-btn value="deposit" width="50%">รายรับ</v-btn>
                <v-btn value="withdraw" width="50%">รายจ่าย</v-btn>
              </v-btn-toggle>
            </v-col>
          </v-row>

          <v-row class="mt-3" no-gutters>
            <v-col cols="4" class="d-flex align-center">บัญชี</v-col>
            <v-col>
              <v-autocomplete
                class="pl-3"
                v-model="formData.account_id"
                :items="accounts"
                item-title="account_number"
                item-value="id"
                density="compact"
                hide-details
                :rules="[(value) => !!value || 'Required.']"
              >
                <template v-slot:item="{ props, item }">
                  <v-list-item
                    v-bind="props"
                    :title="item.raw.account_number"
                    :subtitle="`${item.raw.account_name} - ${item.raw.account_bank}`"
                  >
                  </v-list-item>
                </template>
              </v-autocomplete>
            </v-col>
          </v-row>

          <v-row class="mt-3" no-gutters>
            <v-col cols="4" class="d-flex align-center">วันที่</v-col>
            <v-col>
              <v-text-field
                class="pl-3"
                v-model="formData.transaction_date"
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

          <v-row v-if="!props.transaction_type" class="mt-3" no-gutters>
            <v-col cols="4" class="d-flex align-center">รายการ</v-col>
            <v-col>
              <v-text-field
                class="pl-3"
                v-model="formData.transaction_type"
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
            <v-col cols="4" class="d-flex align-center">จำนวนเงิน</v-col>
            <v-col>
              <v-text-field
                class="pl-3 right-input"
                v-model.number="formData.transaction_amount"
                type="number"
                append-inner-icon="mdi-currency-thb"
                density="compact"
                outlined
                dense
                hide-details
                :rules="[(value) => !isNaN(parseFloat(value)) || 'Must be a number']"
              >
              </v-text-field>
            </v-col>
          </v-row>
          <v-row class="mt-3" no-gutters>
            <v-col cols="4" class="d-flex align-center">สลิป</v-col>
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
                  (value) => !!value.length || '!! กรุณาอัพโหลดรูปภาพ',
                  (value) => !value.length || value[0].size < 10000000 || '!! รูปภาพต้องน้อยกว่า 10 MB',
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
                v-model="formData.transaction_note"
                density="compact"
                outlined
                dense
                hide-details
              >
              </v-textarea>
            </v-col>
          </v-row>

          <v-btn
            v-if="props.actionType == 'edit'"
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
  id: Number,
  dialog: { type: Boolean, default: false },
  account_id: { type: Number, default: null },
  booking_id: { type: Number, default: null },
  car_id: { type: Number, default: null },
  type: { type: String, default: "deposit" },
  transaction_type: { type: String, default: null },
  actionType: String,
  appearance: String,
});
const { $toast } = useNuxtApp();
const emit = defineEmits(["success", "close"]);

// Get Accounts
const accounts = ref([]);
const getAccounts = async () => {
  const response = await useApiAccounts().index();
  accounts.value = response.data.filter((item) => item.account_status == "เปิดใช้งาน");
};
getAccounts();

//Set common variable
const dialog = ref(false);
const formTitle = ref("");

// Get Data
const getData = async () => {
  loading.value = true;
  const response = await useApiAccountTransactions().show(props.id);
  formData.value = response.data;
  formData.value.transaction_date = useGlobalFunction().toDatetimeLocal(response.data.transaction_date);
  if (formData.value.type == "withdraw") {
    // formData.value.transaction_amount = Math.abs(response.data.transaction_amount);
    formData.value.transaction_amount = Number(response.data.transaction_amount) * -1;
  }
  loading.value = false;
};

// Submit Data
const loading = ref(false);
const form = ref(null);
const formData = ref({});
const file = ref([]);
const onSubmit = async () => {
  const formValue = form.value;
  const validate = await formValue.validate();
  if (validate.valid) {
    loading.value = true;

    let formDataNew = new FormData();
    formDataNew.append("account_id", formData.value.account_id);
    formDataNew.append("transaction_date", formData.value.transaction_date);
    formDataNew.append("type", formData.value.type);
    if (formData.value.type == "withdraw") {
      formDataNew.append("transaction_amount", Number(formData.value.transaction_amount) * -1);
    } else {
      formDataNew.append("transaction_amount", formData.value.transaction_amount);
    }
    formDataNew.append("location", "slip");
    formData.value.transaction_note ? formDataNew.append("transaction_note", formData.value.transaction_note) : "";
    for (let i = 0; i < file.value.files.length; i++) {
      formDataNew.append("files", file.value.files[i]);
    }
    let response;
    if (props.actionType == "add") {
      props.transaction_type
        ? formDataNew.append("transaction_type", props.transaction_type)
        : formDataNew.append("transaction_type", formData.value.transaction_type);
      props.booking_id ? formDataNew.append("booking_id", props.booking_id) : "";
      props.car_id ? formDataNew.append("car_id", props.car_id) : "";
      response = await useApiAccountTransactions().store(formDataNew);
    } else {
      formDataNew.append("transaction_type", formData.value.transaction_type);
      response = await useApiAccountTransactions().update(props.id, formDataNew);
    }
    response.status == 200
      ? ($toast.success("ทำรายการสำเร็จ"), (dialog.value = false), emit("success"))
      : $toast.error("เกิดข้อผิดพลาด! กรุณาติดต่อผู้แลระบบ");
    loading.value = false;
  }
};

const id = ref(0);
const dialogDelete = ref(false);
const deleteItem = async () => {
  loading.value = true;
  dialogDelete.value = false;
  const response = await useApiAccountTransactions().destroy(id.value);
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
          props.account_id ? (formData.value.account_id = props.account_id) : null;
          props.type ? (formData.value.type = props.type) : null;
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
