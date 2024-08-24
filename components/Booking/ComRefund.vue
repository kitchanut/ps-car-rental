<template>
  <div>
    <v-card class="mb-1 py-2" border flat>
      <v-row style="height: 100%" no-gutters="">
        <v-col cols="4" class="d-flex justify-center align-center">มัดจำ</v-col>
        <v-col class="d-flex justify-center align-center" style="border-left: 1px solid #eee">
          <span style="font-size: 1.2rem; font-weight: 700; color: green">{{ totalDeposit.toLocaleString() }}</span>
        </v-col>
      </v-row>
    </v-card>
    <v-card class="mb-1 py-2" border flat>
      <v-row style="height: 100%" no-gutters="">
        <v-col cols="4" class="d-flex justify-center align-center">ค่าปรับ</v-col>
        <v-col class="d-flex justify-center align-center" style="border-left: 1px solid #eee">
          <span style="font-size: 1.2rem; font-weight: 700; color: red">
            {{ return_penalty.toLocaleString() }}
          </span>
        </v-col>
      </v-row>
    </v-card>
    <v-card class="mb-1 py-2" border flat>
      <v-row style="height: 100%" no-gutters="">
        <v-col cols="4" class="d-flex justify-center align-center"> เงินที่ต้องคืน</v-col>
        <v-col class="d-flex justify-center align-center" style="border-left: 1px solid #eee">
          <span style="font-size: 1.2rem; font-weight: 700; color: blue">
            {{ (totalDeposit - return_penalty).toLocaleString() }}
          </span>
        </v-col>
      </v-row>
    </v-card>
    <div class="mt-5"></div>
    <v-divider v-if="data.length" class="my-5">รายการคืนเงิน</v-divider>
    <v-data-iterator v-if="data.length" class="mb-5" :items="data" :items-per-page="10" :search="search">
      <template v-slot:default="{ items }">
        <v-card v-for="item in items" class="mb-2" border flat>
          <v-row no-gutters>
            <v-col cols="2" v-viewer>
              <v-img
                :src="item.raw.upload ? $getImage(item.raw.upload.file_path) : $imageBaseApp()"
                :lazy-src="item.raw.upload ? $getImage(item.raw.upload.file_path) : $imageBaseApp()"
                height="100%"
                cover
              />
            </v-col>
            <v-col
              class="pa-3"
              @click="
                dialog = true;
                id = item.raw.id;
              "
            >
              <div>{{ $dayjs(item.raw.transaction_date).format("YYYY-MM-DD HH:mm") }}</div>
              <div style="color: blue">{{ item.raw.account_number }}</div>
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
              <b style="color: orange">{{ Number(item.raw.transaction_amount * -1).toLocaleString() }}</b>
            </v-col>
          </v-row>
        </v-card>
      </template>
    </v-data-iterator>

    <!-- <v-card class="mb-5" border flat height="70px">
      <v-row style="height: 100%" no-gutters="">
        <v-col cols="4" class="d-flex justify-center align-center">รวมมัดจำ</v-col>
        <v-col class="d-flex justify-center align-center" style="border-left: 1px solid #eee">
          <span style="font-size: 1.2rem; font-weight: 700; color: green">{{ totalValue.toLocaleString() }}</span>
        </v-col>
      </v-row>
    </v-card> -->

    <DialogAccountTransaction
      v-if="!data.length"
      :booking_id="props.booking_id"
      type="withdraw"
      transaction_type="คืนเงินมัดจำ"
      appearance="addFullWidthRefund"
      actionType="add"
      @success="success()"
    />

    <DialogAccountTransaction
      :dialog="dialog"
      :id="id"
      type="withdraw"
      transaction_type="คืนเงินมัดจำ"
      actionType="edit"
      @success="getData()"
      @close="dialog = false"
    />
  </div>
</template>
<script setup>
const { $toast } = useNuxtApp();
const emit = defineEmits(["success", "close"]);
const props = defineProps({
  step: { type: String, default: null },
  booking_id: Number,
  booking_status: String,
});
const dialog = ref(false);
const id = ref(null);

const loading = ref(false);
const search = ref("");

onMounted(() => {
  getDeposit();
  getReturn();
  getData();
});

const data = ref([]);
const getData = async () => {
  loading.value = true;
  let query = `?booking_id=${props.booking_id}&&transaction_type=คืนเงินมัดจำ`;
  const response = await useApiAccountTransactions().index(query);
  data.value = response.data;
  data.value.map((item) => {
    item.account_number = item.account.account_number;
  });
  loading.value = false;
};

const deposits = ref([]);
const getDeposit = async () => {
  let query = `?booking_id=${props.booking_id}&&transaction_type=รับเงินมัดจำ`;
  const response = await useApiAccountTransactions().index(query);
  deposits.value = response.data;
};
const totalDeposit = computed(() => deposits.value.reduce((sum, item) => sum + item.transaction_amount, 0));

const return_penalty = ref(0);
const getReturn = async () => {
  let query = props.booking_id ? `?booking_id=${props.booking_id}` : "";
  const response = await useApiBookingReturns().index(query);
  return_penalty.value = response.data[0].return_penalty;
};

const success = async () => {
  loading.value = true;
  if (props.booking_status == "คืนรถ") {
    let formData = {
      booking_status: "คืนมัดจำ",
    };
    const response = await useApiBookings().update(props.booking_id, formData);
    response.status == 200 ? emit("success") : $toast.error("เกิดข้อผิดพลาด! กรุณาติดต่อผู้แลระบบ");
  }
  loading.value = false;
  getData();
};

watch(
  () => props.step,
  (newValue, oldValue) => {
    if (newValue == "5") {
      getDeposit();
      getReturn();
    }
  }
);
</script>

<style scoped>
.right-input :deep() input {
  text-align: right;
}
</style>
