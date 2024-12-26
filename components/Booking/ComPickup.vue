<template>
  <div>
    <v-timeline align="start" side="end" density="compact" justify="center">
      <v-timeline-item size="small" width="100%" :dot-color="pickupAccountTransactions.length ? 'success' : 'grey'">
        <v-card class="mb-1 py-2" border flat>
          <v-table density="compact">
            <thead>
              <tr>
                <th class="text-left">ทั้งหมด</th>
                <th class="text-left">เงินจอง</th>
                <th class="text-left">ต้องชำระ</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <span style="font-size: 1.2rem; font-weight: 700; color: red">
                    {{ net_total.toLocaleString() }}
                  </span>
                </td>
                <td>
                  <span style="font-size: 1.2rem; font-weight: 700; color: green">{{
                    totalDeposit.toLocaleString()
                  }}</span>
                </td>
                <td>
                  <span style="font-size: 1.2rem; font-weight: 700; color: blue">
                    {{ (net_total - totalDeposit).toLocaleString() }}
                  </span>
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-card>

        <v-data-iterator
          v-if="pickupAccountTransactions.length"
          class="mb-1"
          :items="pickupAccountTransactions"
          :items-per-page="10"
        >
          <template v-slot:default="{ items }">
            <v-card v-for="item in items" class="mt-1" border flat>
              <v-row no-gutters>
                <!-- <v-col cols="2" v-viewer>
              <v-img
                :src="item.raw.uploads.length ? $getImage(item.raw.uploads[0].file_path) : $imageBaseApp()"
                :lazy-src="item.raw.uploads.length ? $getImage(item.raw.uploads[0].file_path) : $imageBaseApp()"
                height="100%"
                cover
              />
            </v-col> -->
                <v-col
                  class="pa-3"
                  @click="
                    dialog = true;
                    id = item.raw.id;
                  "
                >
                  <div>{{ $dayjs(item.raw.transaction_date).format("YYYY-MM-DD HH:mm") }}</div>
                  <div style="color: blue">{{ item.raw.accounts.account_number }}</div>
                </v-col>
                <v-col
                  class="d-flex justify-center align-center"
                  cols="3"
                  style="border-left: 1px solid #eee"
                  @click="
                    dialog = true;
                    id = item.raw.id;
                  "
                >
                  <b style="color: orange">{{ Number(item.raw.transaction_amount).toLocaleString() }}</b>
                </v-col>
              </v-row>
            </v-card>
          </template>
        </v-data-iterator>

        <!-- สำหรับการเพิ่ม -->
        <DialogAccountTransaction
          :booking_id="props.booking_id"
          :car_id="props.car_id"
          :account_id="1"
          transaction_type="pickup"
          transaction_details="รับเงินค่าเช่าและมัดจำ"
          appearance="addFullWidthDeposit"
          actionType="add"
          @success="success()"
        />
      </v-timeline-item>
      <v-timeline-item size="small" :dot-color="actionType == 'edit' ? 'success' : 'grey'">
        <v-form ref="form" lazy-validation @submit.prevent="onSubmit()">
          <v-card class="border" variant="outlined">
            <v-card-text>
              <v-row no-gutters>
                <v-col cols="3" class="d-flex align-center">วันรับรถ</v-col>
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

              <!-- <v-row v-if="actionType == 'add'" class="mt-3" no-gutters>
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
          </v-row> -->
              <v-row class="mt-3" no-gutters>
                <v-col cols="3" class="d-flex align-center">หมายเหตุ</v-col>
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
            </v-card-text>
          </v-card>
          <v-btn :loading="loading" class="mt-1" type="submit" color="primary" variant="tonal" size="x-large" block>
            รับรถ
          </v-btn>
        </v-form>
      </v-timeline-item>
    </v-timeline>

    <!-- สำหรับการแก้ไข -->
    <DialogAccountTransaction
      :dialog="dialog"
      :id="id"
      transaction_type="deposit"
      transaction_details="รับเงินจอง"
      actionType="edit"
      @success="getPickupAccountTransactions()"
      @close="dialog = false"
    />

    <DialogDelete :dialogDelete="dialogDelete" @cancleItem="dialogDelete = false" @deleteItem="deleteItem" />
  </div>
</template>
<script setup>
const props = defineProps({
  step: { type: String, default: null },
  booking_id: { type: Number, default: null },
  booking_status: String,
  car_id: { type: Number, default: null },
});
const supabase = useNuxtApp().$supabase;
const { $toast } = useNuxtApp();
const emit = defineEmits(["success", "close"]);

// Common Variables
const loading = ref(false);
const form = ref(null);
const formData = ref({});
const actionType = ref("");
const loadingImage = ref(false);
const dialog = ref(false);
const id = ref(null);

const getData = async () => {
  loading.value = true;
  // let query = props.booking_id ? `?booking_id=${props.booking_id}` : "";
  // const response = await useApiBookingPickups().index(query);
  let { data: response, error } = await supabase
    .from("booking_pickups")
    .select("*")
    .eq("booking_id", props.booking_id)
    .single();

  if (response) {
    actionType.value = "edit";
    formData.value = response;
    formData.value.pickup_date = useGlobalFunction().toDatetimeLocal(response.pickup_date);
  } else {
    actionType.value = "add";
    formData.value = {};
    form.value.reset();
    formData.value.pickup_date = useGlobalFunction().toDatetimeLocal(new Date());
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
      let { data: response, error } = await supabase.from("booking_pickups").insert({
        pickup_date: formData.value.pickup_date,
        pickup_note: formData.value.pickup_note,
        booking_id: Number(props.booking_id),
      });
      if (error) {
        $toast.error(error.message);
      } else {
        $toast.success("ทำรายการสำเร็จ");
        getData();
      }
    } else {
      let { data: response, error } = await supabase
        .from("booking_pickups")
        .update(formData.value)
        .eq("id", formData.value.id);
      if (error) {
        $toast.error(error.message);
      }
    }
    if (props.booking_status == "รับเงินจอง") {
      let { data: response, error } = await supabase
        .from("bookings")
        .update({ booking_status: "รับรถ" })
        .eq("id", props.booking_id);
      if (error) {
        $toast.error(error.message);
      } else {
        $toast.success("ทำรายการสำเร็จ");
        emit("success");
      }
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

// Account Transaction

const totalDeposit = ref(0);
const net_total = computed(() => booking.value.net_total || 0);
const getDeposit = async () => {
  let { data: response, error } = await supabase
    .from("account_transactions")
    .select("*,accounts(*)")
    .eq("booking_id", props.booking_id)
    .eq("transaction_type", "deposit");
  if (error) {
    $toast.error(error.message);
  } else {
    totalDeposit.value = response.reduce((sum, item) => sum + item.transaction_amount, 0);
  }
};
getDeposit();

const pickupAccountTransactions = ref([]);
const getPickupAccountTransactions = async () => {
  let { data: response, error } = await supabase
    .from("account_transactions")
    .select("*,accounts(*)")
    .eq("booking_id", props.booking_id)
    .eq("transaction_type", "pickup");
  if (error) {
    $toast.error(error.message);
  } else {
    pickupAccountTransactions.value = response;
  }
};
getPickupAccountTransactions();

// Get Accounts
const accounts = ref([]);
const getAccounts = async () => {
  // const response = await useApiAccounts().index();
  // accounts.value = response.data.filter((item) => item.account_status == "เปิดใช้งาน");
  let { data: response, error } = await supabase.from("accounts").select("*").eq("account_status", "เปิดใช้งาน");
  if (error) {
    $toast.error(error.message);
  } else {
    accounts.value = response;
  }
};
getAccounts();

// Get Data
const booking = ref({});
const getBooking = async () => {
  // const response = await useApiBookings().show(props.booking_id);
  let { data: response, error } = await supabase.from("bookings").select("*").eq("id", props.booking_id).single();
  if (error) {
    $toast.error(error.message);
  } else {
    booking.value = response;
  }
};
getBooking();

const success = () => {
  getData();
  getPickupAccountTransactions();
};

watch(
  () => props.step,
  (newValue) => {
    if (newValue == "3") {
      getData();
      getBooking();
      getDeposit();
    }
  },
  { immediate: true }
);
</script>
