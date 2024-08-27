<template>
  <div>
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
              <b style="color: green">{{ Number(item.raw.transaction_amount).toLocaleString() }}</b>
            </v-col>
          </v-row>
        </v-card>
      </template>
    </v-data-iterator>

    <v-card class="mb-5" border flat height="70px">
      <v-row style="height: 100%" no-gutters="">
        <v-col cols="4" class="d-flex justify-center align-center">รวมมัดจำ</v-col>
        <v-col class="d-flex justify-center align-center" style="border-left: 1px solid #eee">
          <span style="font-size: 1.2rem; font-weight: 700; color: green">{{ totalValue.toLocaleString() }}</span>
        </v-col>
      </v-row>
    </v-card>

    <!-- สำหรับการเพิ่ม -->
    <DialogAccountTransaction
      :booking_id="props.booking_id"
      :car_id="props.car_id"
      transaction_type="รับเงินมัดจำ"
      appearance="addFullWidthDeposit"
      actionType="add"
      @success="success()"
    />

    <!-- สำหรับการแก้ไข -->
    <DialogAccountTransaction
      :dialog="dialog"
      :id="id"
      transaction_type="รับเงินมัดจำ"
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
  booking_id: Number,
  car_id: Number,
  booking_status: String,
});
const dialog = ref(false);
const id = ref(null);

const loading = ref(false);
const search = ref("");
const data = ref([]);
onMounted(() => {
  getData();
});
const getData = async () => {
  loading.value = true;
  let query = `?booking_id=${props.booking_id}&&transaction_type=รับเงินมัดจำ`;
  const response = await useApiAccountTransactions().index(query);
  data.value = response.data;

  data.value.map((item) => {
    item.account_number = item.account.account_number;
  });

  loading.value = false;
};

const totalValue = computed(() => data.value.reduce((sum, item) => sum + item.transaction_amount, 0));

const success = async () => {
  loading.value = true;
  if (props.booking_status == "จอง") {
    let formData = {
      booking_status: "มัดจำ",
    };
    const response = await useApiBookings().update(props.booking_id, formData);
    response.status == 200 ? emit("success") : $toast.error("เกิดข้อผิดพลาด! กรุณาติดต่อผู้แลระบบ");
  }
  loading.value = false;
  getData();
};

watch(
  () => props.booking_id,
  (newValue, oldValue) => {
    getData();
  },
  { deep: true }
);
</script>

<style scoped>
.right-input :deep() input {
  text-align: right;
}
</style>
