<template>
  <v-dialog v-model="dialog" persistent fullscreen>
    <!-- <template v-slot:activator="{ props: activatorProps }"> </template> -->
    <v-card>
      <v-toolbar dark color="primary" density="comfortable">
        <v-container class="d-flex justify-space-between align-center">
          <v-toolbar-title style="flex: 4 1">
            Booking No: {{ item.booking_number }}
            <v-btn icon="mdi-content-copy" size="small" style="font-size: 0.875rem" @click="copyBookingToClipboard()">
            </v-btn>
          </v-toolbar-title>
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
              <v-col class="text-right">{{ $dayjs(item.booking_date).format("YYYY-MM-DD HH:mm") }}</v-col>
            </v-row>
            <v-row no-gutters>
              <v-col cols="5">วันรับรถ:</v-col>
              <v-col class="text-right">{{ $dayjs(item.pickup_date).format("YYYY-MM-DD HH:mm") }}</v-col>
            </v-row>
            <v-row no-gutters>
              <v-col cols="5">วันคืนรถ:</v-col>
              <v-col class="text-right">{{ $dayjs(item.return_date).format("YYYY-MM-DD HH:mm") }}</v-col>
            </v-row>
            <v-row no-gutters>
              <v-col cols="5">ลูกค้า:</v-col>
              <v-col class="text-right">
                {{ item.customers.customer_name }}
                <span v-if="item.customers.customer_tel">[{{ item.customers.customer_tel }}]</span>
              </v-col>
            </v-row>
            <v-row v-if="item.customers.facebook_name" no-gutters>
              <v-col cols="5">FB:</v-col>
              <v-col class="text-right">
                {{ item.customers.facebook_name }}
              </v-col>
            </v-row>
            <v-row no-gutters>
              <v-col cols="5">รถเช่า:</v-col>
              <v-col class="text-right">
                <div>{{ item.cars.license_plate }} {{ item.cars.license_plate_province }}</div>
                <div>{{ item.cars.car_brands.car_brand_name }} ( {{ item.cars.car_models.car_model_name }} )</div>
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
              <v-col cols="5">ค่าเช่าเกินเวลา:</v-col>
              <v-col class="text-right"
                ><span class="text-blue">{{ Number(item.extra_charge).toLocaleString() }}</span> บาท</v-col
              >
            </v-row>
            <v-row no-gutters>
              <v-col cols="5">ค่าใช้จ่ายเพิ่มเติม:</v-col>
              <v-col class="text-right"
                ><span class="text-blue">{{ Number(item.rental_extra).toLocaleString() }}</span> บาท</v-col
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
              <v-col cols="5">หัก ณ ที่จ่าย ({{ item.withholding_tax_percent }}%):</v-col>
              <v-col class="text-right"
                ><span class="text-blue">{{ Number(item.withholding_tax_amount).toLocaleString() }}</span> บาท</v-col
              >
            </v-row>
            <v-row no-gutters>
              <v-col cols="5">รวมทั้งหมด:</v-col>
              <v-col class="text-right"
                ><span class="text-blue">{{ Number(item.total).toLocaleString() }}</span> บาท</v-col
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
          <v-divider></v-divider>
          <v-card-text>
            <div>หมายเหตุ: {{ item.booking_note || "-" }}</div>
          </v-card-text>
        </v-card>
        <div v-if="item.account_transactions.length">
          <div class="mt-3 ml-2">ข้อมูลการเงิน</div>
          <v-card class="border" variant="text">
            <v-card-text>
              <v-row no-gutters>
                <v-col cols="5">เงินจองที่ต้องชำระ:</v-col>
                <v-col class="text-right">
                  <span>{{ Number(item.booking_fee).toLocaleString() }}</span> บาท
                </v-col>
              </v-row>
              <v-row no-gutters>
                <v-col cols="5">เงินจองที่ชำระแล้ว:</v-col>
                <v-col class="text-right">
                  <span :class="item.booking_fee == sumBookingFee ? 'text-green' : 'text-red'">
                    {{ Number(sumBookingFee).toLocaleString() }}
                  </span>
                  บาท
                </v-col>
              </v-row>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-text>
              <v-row no-gutters>
                <v-col cols="5">ที่ต้องชำระวันรับรถ:</v-col>
                <v-col class="text-right">
                  <span>{{ Number(item.net_total - sumBookingFee).toLocaleString() }}</span> บาท
                </v-col>
              </v-row>
              <v-row no-gutters>
                <v-col cols="5">ชำระจริงวันรับรถ:</v-col>
                <v-col class="text-right">
                  <span :class="item.net_total - sumBookingFee == sumPickup ? 'text-green' : 'text-red'">
                    {{ Number(sumPickup).toLocaleString() }}
                  </span>
                  บาท
                </v-col>
              </v-row>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-text>
              <v-row no-gutters>
                <v-col cols="5">มัดจำ:</v-col>
                <v-col class="text-right">
                  <span>{{ Number(item.deposit).toLocaleString() }}</span> บาท</v-col
                >
              </v-row>
              <v-row no-gutters>
                <v-col cols="5">ค่าปรับ:</v-col>
                <v-col class="text-right">
                  <span v-if="item.booking_returns">
                    {{ Number(item.booking_returns.return_penalty).toLocaleString() }}
                  </span>
                  <span v-else>-</span>
                  บาท
                </v-col>
              </v-row>
              <v-row no-gutters>
                <v-col cols="5">เงินมัดจำที่ต้องคืน:</v-col>
                <v-col class="text-right">
                  <span v-if="item.booking_returns">
                    {{ Number(item.deposit - item.booking_returns.return_penalty).toLocaleString() }}
                  </span>
                  <span v-else>-</span>
                  บาท
                </v-col>
              </v-row>
              <v-row no-gutters>
                <v-col cols="5">รวมคืนเงินมัดจำ:</v-col>
                <v-col class="text-right">
                  <span
                    v-if="item.booking_returns"
                    :class="
                      item.deposit - item.booking_returns.return_penalty == Math.abs(sumRefund)
                        ? 'text-green'
                        : 'text-red'
                    "
                  >
                    {{ Number(Math.abs(sumRefund)).toLocaleString() }}
                  </span>
                  <span v-else>-</span>
                  บาท
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
const dayjs = useDayjs();
const supabase = useNuxtApp().$supabase;
const { $toast } = useNuxtApp();
const emit = defineEmits(["success", "close"]);

//Set common variable
const dialog = ref(false);
const loading = ref(false);

const item = ref({});
const sumBookingFee = ref(0);
const sumPickup = ref(0);
const sumRefund = ref(0);
const getData = async () => {
  loading.value = true;
  const { data: response, error } = await supabase
    .from("bookings")
    .select(
      "*,account_transactions(*),customers(*),cars(*,car_brands(*),car_models(*)),booking_returns(*),booking_pickups(*),branches:bookings_branch_id_fkey(*)"
    )
    .eq("id", props.id)
    .single();

  error ? $toast.error(error.message) : (item.value = response);
  sumBookingFee.value = response.account_transactions
    .filter((item) => item.transaction_type === "deposit")
    .reduce((sum, item) => sum + item.transaction_amount, 0);
  sumPickup.value = response.account_transactions
    .filter((item) => item.transaction_type === "pickup")
    .reduce((sum, item) => sum + item.transaction_amount, 0);
  sumRefund.value = response.account_transactions
    .filter((item) => item.transaction_type === "refund")
    .reduce((sum, item) => sum + item.transaction_amount, 0);

  loading.value = false;
};

const period_day = computed({
  get() {
    if (item.value.pickup_date && item.value.return_date) {
      const date1 = dayjs(item.value.pickup_date);
      const date2 = dayjs(item.value.return_date);
      const diffInDays = date2.diff(date1, "day");
      return Math.max(diffInDays, 0);
    }
    return 0;
  },
  set(newValue) {},
});

const period_remain_hours = computed({
  get() {
    if (item.value.pickup_date && item.value.return_date) {
      const date1 = dayjs(item.value.pickup_date);
      const date2 = dayjs(item.value.return_date);
      const diffInDays = date2.diff(date1, "day");
      const remainingHours = date2.diff(date1.add(diffInDays, "day"), "hour");
      return Math.max(remainingHours, 0);
    }
    return 0;
  },
  set(newValue) {},
});

const copyBookingToClipboard = () => {
  // let text = `
  // รหัสการจอง : ${item.value.booking_number}
  // ผู้จอง : ${item.value.customers.customer_name}
  // รถ : ${item.value.cars.car_brands.car_brand_name} ${item.value.cars.car_models.car_model_name}
  // วันรับรถ : ${dayjs(item.value.pickup_date).format("DD/MM/YYYY HH:mm")}
  // วันคืนรถ : ${dayjs(item.value.return_date).format("DD/MM/YYYY HH:mm")}
  // จำนวนวัน : ${period_day.value} วัน ${period_remain_hours.value} ชั่วโมง

  // ค่าเช่าทั้งหมด : ${Number(item.value.rental).toLocaleString()} บาท
  // ${item.value.driver_per_day ? `ค่าคนขับ : ${Number(item.value.driver_per_day).toLocaleString()} บาท` : ""}
  // ค่าเช่าเกินเวลา: ${Number(item.value.extra_charge).toLocaleString()} บาท
  // `;

  let text = `Booking No: ${item.value.booking_number}\n`;
  text += `\n`;
  text += `ผู้จอง : ${item.value.customers.customer_name}\n`;
  if (item.value.customers.customer_tel) {
    text += `เบอร์โทร : ${item.value.customers.customer_tel}\n`;
  }
  text += `รถ : ${item.value.cars.car_brands.car_brand_name} ${item.value.cars.car_models.car_model_name}\n`;

  text += `\n`;
  text += `วันรับรถ : ${dayjs(item.value.pickup_date).format("DD/MM/YYYY HH:mm")}\n`;
  text += `วันคืนรถ : ${dayjs(item.value.return_date).format("DD/MM/YYYY HH:mm")}\n`;
  text += `จำนวนวัน : ${period_day.value} วัน ${period_remain_hours.value} ชั่วโมง\n`;

  text += `\n`;
  text += `ค่าเช่าต่อวัน : ${Number(item.value.rental_per_day).toLocaleString()} บาท x ${period_day.value} วัน\n`;
  text += `ค่าเช่าทั้งหมด : ${Number(item.value.rental).toLocaleString()} บาท\n`;
  if (item.value.driver_per_day) {
    text += `ค่าคนขับ : ${Number(item.value.driver_per_day).toLocaleString()} บาท\n`;
  }
  text += `ค่าเช่าเกินเวลา: ${Number(item.value.extra_charge).toLocaleString()} บาท\n`;
  if (item.value.rental_extra) {
    text += `ค่าใช้จ่ายเพิ่มเติม: ${Number(item.value.rental_extra).toLocaleString()} บาท\n`;
  }
  if (item.value.discount) {
    text += `ส่วนลด: ${Number(item.value.discount).toLocaleString()} บาท\n`;
  }

  if (item.value.withholding_tax_amount) {
    text += `รวม: ${Number(item.value.sub_total).toLocaleString()} บาท\n`;
    text += `หัก ณ ที่จ่าย (${item.value.withholding_tax_percent}%): ${Number(
      item.value.withholding_tax_amount
    ).toLocaleString()} บาท\n`;
    text += `รวมทั้งหมด: ${Number(item.value.sub_total).toLocaleString()} บาท\n`;
    text += `มัดจำ: ${Number(item.value.deposit).toLocaleString()} บาท\n`;
    text += `รวมสุทธิ: ${Number(item.value.net_total).toLocaleString()} บาท\n`;
  } else {
    text += `รวมทั้งหมด: ${Number(item.value.sub_total).toLocaleString()} บาท\n`;
    text += `มัดจำ: ${Number(item.value.deposit).toLocaleString()} บาท\n`;
    text += `รวมสุทธิ: ${Number(item.value.net_total).toLocaleString()} บาท\n`;
  }

  text += `\n`;
  text += `เงินจอง: ${Number(item.value.booking_fee).toLocaleString()} บาท\n`;
  text += `ยอดชำระวันรับรถ: ${Number(item.value.net_total - item.value.booking_fee).toLocaleString()} บาท\n`;

  if (item.value.booking_note) {
    text += `\n`;
    text += `หมายเหตุ: ${item.value.booking_note}\n`;
  }

  text += `\n`;
  text += `**รับรถน้ำมันเต็มถัง/คืนรถเติมเต็มถังคืน**\n`;

  text += `\n`;
  text += `ติดต่อ\n`;
  text += `${item.value.branches.branch_tel}\n`;
  text += `PS Car Rental\n`;
  text += `สาขา${item.value.branches.branch_name}\n`;
  text += `ขอบพระคุณค่ะ`;

  navigator.clipboard.writeText(text);
  $toast.success("คัดลอกสําเร็จ");
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
