<template>
  <v-dialog v-model="dialog" persistent fullscreen>
    <!-- <template v-slot:activator="{ props: activatorProps }"> </template> -->
    <v-card>
      <v-toolbar dark color="primary" density="comfortable">
        <v-container class="d-flex justify-space-between align-center">
          <v-toolbar-title style="flex: 4 1">Booking No: {{ item.booking_number }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon dark @click="onClose()">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-container>
      </v-toolbar>
      <v-container v-if="loading" style="height: 70vh">
        <v-row align-content="center" class="fill-height" justify="center">
          <v-col class="text-subtitle-1 text-center" cols="12"> กรุณารอสักครู่ </v-col>
          <v-col cols="6">
            <v-progress-linear color="primary" height="6" indeterminate rounded></v-progress-linear>
          </v-col>
        </v-row>
      </v-container>
      <v-container v-else>
        <div class="ml-2">ข้อมูลการจอง</div>
        <v-card class="border" variant="text">
          <v-card-text>
            <v-row no-gutters>
              <v-col cols="5">วันจอง:</v-col>
              <v-col>{{ $dayjs(item.booking_date).format("YYYY-MM-DD HH:mm") }}</v-col>
            </v-row>
            <v-row no-gutters>
              <v-col cols="5">วันรับรถ:</v-col>
              <v-col>{{ $dayjs(item.pickup_date).format("YYYY-MM-DD HH:mm") }}</v-col>
            </v-row>
            <v-row no-gutters>
              <v-col cols="5">วันคืนรถ:</v-col>
              <v-col>{{ $dayjs(item.return_date).format("YYYY-MM-DD HH:mm") }}</v-col>
            </v-row>
            <v-row no-gutters>
              <v-col cols="5">ลูกค้า:</v-col>
              <v-col>
                {{ item.customer.customer_name }}
                <span v-if="item.customer.customer_tel">[{{ item.customer.customer_tel }}]</span>
              </v-col>
            </v-row>
            <v-row no-gutters>
              <v-col cols="5">รถเช่า:</v-col>
              <v-col>
                <div>{{ item.car.license_plate }} {{ item.car.license_plate_province }}</div>
                <div>{{ item.car.car_brand.car_brand_name }} ( {{ item.car.car_model.car_model_name }} )</div>
              </v-col>
            </v-row>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-text>
            <v-row no-gutters>
              <v-col cols="5">ค่าเช่าทั้งหมด:</v-col>
              <v-col class="text-right"
                ><span class="text-blue">{{ Number(item.rental).toLocaleString() }}</span> บาท</v-col
              >
            </v-row>
            <v-row no-gutters>
              <v-col cols="5">คนขับ:</v-col>
              <v-col class="text-right">
                <span class="text-blue">{{ Number(item.driver_per_day).toLocaleString() }}</span> บาท
              </v-col>
            </v-row>
            <v-row no-gutters>
              <v-col cols="5">ค่าเช่าเพิ่มเติม:</v-col>
              <v-col class="text-right"
                ><span class="text-blue">{{ Number(item.extra_charge).toLocaleString() }}</span> บาท</v-col
              >
            </v-row>
            <v-row no-gutters>
              <v-col cols="5">ส่วนลด:</v-col>
              <v-col class="text-right"
                ><span class="text-blue">{{ Number(item.discount).toLocaleString() }}</span> บาท</v-col
              >
            </v-row>
            <v-row no-gutters>
              <v-col cols="5">รวม:</v-col>
              <v-col class="text-right"
                ><span class="text-blue">{{ Number(item.discount).toLocaleString() }}</span> บาท</v-col
              >
            </v-row>
            <v-row no-gutters>
              <v-col cols="5">vat:</v-col>
              <v-col class="text-right"
                ><span class="text-blue">{{ Number(item.vat_amount).toLocaleString() }}</span> บาท</v-col
              >
            </v-row>
            <v-row no-gutters>
              <v-col cols="5">รวมทั้งหมด:</v-col>
              <v-col class="text-right"
                ><span class="text-blue">{{ Number(item.vat_amount).toLocaleString() }}</span> บาท</v-col
              >
            </v-row>
            <v-row no-gutters>
              <v-col cols="5">มัดจำ:</v-col>
              <v-col class="text-right"
                ><span class="text-blue">{{ Number(item.deposit).toLocaleString() }}</span> บาท</v-col
              >
            </v-row>
            <v-row no-gutters>
              <v-col cols="5">รวมสุทธิ:</v-col>
              <v-col class="text-right">
                <span class="text-blue">{{ Number(item.net_total).toLocaleString() }}</span> บาท
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
        <div v-if="item.account_transactions.length">
          <div class="mt-3 ml-2">ข้อมูลการเงิน</div>
          <v-card class="border" variant="text">
            <v-card-text>
              <v-row no-gutters>
                <v-col cols="5">รวมรับเงินมัดจำ:</v-col>
                <v-col class="text-right">
                  <b class="text-blue">{{ Number(sumDeposit).toLocaleString() }}</b> บาท
                </v-col>
              </v-row>
              <v-row no-gutters>
                <v-col cols="5">ค่าปรับ:</v-col>
                <v-col class="text-right">
                  <span class="text-red" v-if="item.booking_returns">{{
                    Number(item.booking_returns.return_penalty).toLocaleString()
                  }}</span>
                  <span v-else>-</span>
                  บาท
                </v-col>
              </v-row>
              <v-row no-gutters>
                <v-col cols="5">เงินมัดจำที่ต้องคืน:</v-col>
                <v-col class="text-right">
                  <span v-if="item.booking_returns" class="text-orange">
                    {{ Number(sumDeposit - item.booking_returns.return_penalty).toLocaleString() }}
                  </span>
                  <span v-else>-</span>
                  บาท
                </v-col>
              </v-row>
              <v-row no-gutters>
                <v-col cols="5">รวมคืนเงินมัดจำ:</v-col>
                <v-col class="text-right">
                  <b class="text-green">{{ Number(Math.abs(sumRefund)).toLocaleString() }}</b> บาท
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </div>
        <div v-if="item.booking_pickups">
          <div class="mt-3 ml-2">ข้อมูลการรับรถ</div>
          <v-card class="border" variant="text">
            <v-card-text>
              <v-row no-gutters>
                <v-col cols="5">วันรับรถ:</v-col>
                <v-col>{{ $dayjs(item.booking_pickups.pickup_date).format("YYYY-MM-DD HH:mm") }}</v-col>
              </v-row>
              <v-row no-gutters>
                <v-col cols="5">หมายเหตุ:</v-col>
                <v-col>{{ item.booking_pickups.pickup_note ?? "-" }}</v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </div>
        <div v-if="item.booking_returns">
          <div class="mt-3 ml-2">ข้อมูลการคืนรถ</div>
          <v-card class="border" variant="text">
            <v-card-text>
              <v-row no-gutters>
                <v-col cols="5">วันคืนรถ:</v-col>
                <v-col>{{ $dayjs(item.booking_returns.return_date).format("YYYY-MM-DD HH:mm") }}</v-col>
              </v-row>
              <v-row no-gutters>
                <v-col cols="5">ค่าปรับ:</v-col>
                <v-col>
                  <span class="text-red">{{ Number(item.booking_returns.return_penalty).toLocaleString() }}</span>
                  บาท
                </v-col>
              </v-row>
              <v-row no-gutters>
                <v-col cols="5">หมายเหตุ:</v-col>
                <v-col>{{ item.booking_returns.return_note ?? "-" }}</v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </div>
      </v-container>
    </v-card>
  </v-dialog>
</template>
<script setup>
const props = defineProps({
  dialog: { type: Boolean, default: false },
  id: Number,
});
const emit = defineEmits(["success", "close"]);

//Set common variable
const dialog = ref(false);
const loading = ref(false);

const item = ref({});
const sumDeposit = ref(0);
const sumRefund = ref(0);
const getData = async () => {
  loading.value = true;
  const response = await useApiBookings().show(props.id);
  console.log(response.data);
  item.value = response.data;
  sumDeposit.value = response.data.account_transactions
    .filter((item) => item.transaction_type === "รับเงินมัดจำ")
    .reduce((sum, item) => sum + item.transaction_amount, 0);
  sumRefund.value = response.data.account_transactions
    .filter((item) => item.transaction_type === "คืนเงินมัดจำ")
    .reduce((sum, item) => sum + item.transaction_amount, 0);

  loading.value = false;
};

const onClose = () => {
  dialog.value = false;
  emit("close");
};

// Check dialog isOpen
watch(dialog, (value) => {
  if (value) {
    getData();
  }
});

watch(
  () => props.dialog,
  (value) => {
    dialog.value = value;
  }
);
</script>
