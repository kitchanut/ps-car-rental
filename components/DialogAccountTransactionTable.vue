<template>
  <v-dialog v-model="dialog" fullscreen :scrim="false" transition="dialog-bottom-transition">
    <template v-slot:activator="{ props: activatorProps }">
      <v-btn
        v-if="appearance == 'list'"
        color="success"
        dark
        v-bind="activatorProps"
        icon="mdi-format-list-bulleted"
        density="comfortable"
        size="small"
        variant="tonal"
      >
      </v-btn>
    </template>

    <v-card>
      <v-toolbar dark color="primary" density="comfortable">
        <v-container class="d-flex justify-space-between align-center">
          <v-btn icon dark @click="onClose()">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>{{ formTitle }}</v-toolbar-title>
        </v-container>
      </v-toolbar>
      <v-container>
        <v-card variant="text" border>
          <div class="d-flex ma-3">
            <DialogAccountTransaction
              :account_id="props.account_id"
              :car_id="props.car_id"
              appearance="add"
              actionType="add"
              @success="getData()"
            />
            <v-text-field
              class="pl-3"
              v-model="search"
              append-inner-icon="mdi-magnify"
              label="ค้นหา"
              single-line
              hide-details
              density="compact"
            ></v-text-field>
          </div>

          <div class="text-right px-2 mb-2">
            <v-btn-toggle
              v-model="period"
              color="warning"
              variant="outlined"
              divided
              density="compact"
              :disabled="loading"
            >
              <v-btn value="D" size="small" style="min-width: 20px"><b>D</b></v-btn>
              <v-btn value="W" size="small" style="min-width: 20px"><b>W</b></v-btn>
              <v-btn value="M" size="small" style="min-width: 20px"><b>M</b></v-btn>
              <v-btn value="3M" size="small" style="min-width: 20px"><b>3M</b></v-btn>
              <v-btn value="6M" size="small" style="min-width: 20px"><b>6M</b></v-btn>
              <v-btn value="Y" size="small" style="min-width: 20px"><b>Y</b></v-btn>
            </v-btn-toggle>
          </div>

          <v-row class="mb-2" no-gutters>
            <v-col class="px-1">
              <v-btn color="success" variant="tonal" block>+{{ sumIncome.toLocaleString() }}</v-btn>
            </v-col>
            <v-col class="px-1">
              <v-btn color="red" variant="tonal" block>{{ sumExpense.toLocaleString() }}</v-btn>
            </v-col>
            <v-col class="px-1">
              <v-btn color="primary" variant="tonal" block>
                {{ Number(sumIncome + sumExpense).toLocaleString() }}
              </v-btn>
            </v-col>
          </v-row>

          <v-divider></v-divider>
          <v-data-table
            :headers="headers"
            :items="data"
            :loading="loading"
            :search="search"
            density="compact"
            hide-default-footer
            :items-per-page="-1"
            @click:row="handleClick"
          >
            <template v-slot:item.transaction_amount="{ item }">
              <span v-if="item.transaction_amount > 0" style="color: green">
                +{{ Number(item.transaction_amount).toLocaleString() }}
              </span>
              <span v-else-if="item.transaction_amount < 0" style="color: red">
                {{ Number(item.transaction_amount).toLocaleString() }}
              </span>
            </template>
          </v-data-table>
        </v-card>
      </v-container>
    </v-card>

    <DialogAccountTransaction
      :dialog="dialogTransaction"
      :id="transaction_id"
      :account_id="props.account_id"
      actionType="edit"
      @success="getData()"
      @close="dialogTransaction = false"
    />

    <!-- <DialogLoader :loading="loading" /> -->
    <!-- <DialogDelete :dialogDelete="dialogDelete" @cancleItem="dialogDelete = false" @deleteItem="deleteItem" /> -->
  </v-dialog>
</template>

<script setup>
const props = defineProps({
  dialog: { type: Boolean, default: false },
  actionType: String,
  appearance: String,
  account_id: Number,
  car_id: Number,
  number: String,
});
const supabase = useNuxtApp().$supabase;
const { $toast } = useNuxtApp();
const dayjs = useDayjs();
const emit = defineEmits(["success", "close"]);

//Set common variable
const dialog = ref(false);
const loading = ref(true);
const formTitle = ref("");

// Get Data
const search = ref("");
const headers = ref([
  { title: "วันที่", key: "transaction_date", value: (item) => dayjs(item.transaction_date).format("YYYY-MM-DD") },
  { title: "รายการ", key: "transaction_details" },
  {
    title: "จำนวน",
    key: "transaction_amount",
    width: "10%",
    align: "end",
    value: (item) => Number(item.transaction_amount).toLocaleString(),
  },
]);

const period = ref("D");
const data = ref([]);
const sumIncome = ref(0);
const sumExpense = ref(0);
const getData = async () => {
  loading.value = true;
  // let queryString = `?period=${period.value}`;
  // if (props.account_id) {
  //   queryString += `&account_id=${props.account_id}`;
  // }
  // if (props.car_id) {
  //   queryString += `&car_id=${props.car_id}`;
  // }

  // const response = await useApiAccountTransactions().index(queryString);
  // data.value = response.data;
  let startDate;
  let endDate;
  if (period.value == "D") {
    startDate = dayjs().startOf("day").format("YYYY-MM-DD");
    endDate = dayjs().endOf("day").format("YYYY-MM-DD 23:59");
  } else if (period.value == "W") {
    startDate = dayjs().startOf("week").format("YYYY-MM-DD");
    endDate = dayjs().endOf("week").format("YYYY-MM-DD 23:59");
  } else if (period.value == "M") {
    startDate = dayjs().startOf("month").format("YYYY-MM-DD");
    endDate = dayjs().endOf("month").format("YYYY-MM-DD 23:59");
  } else if (period.value == "3M") {
    startDate = dayjs().startOf("month").subtract(3, "month").format("YYYY-MM-DD");
    endDate = dayjs().endOf("month").format("YYYY-MM-DD 23:59");
  } else if (period.value == "6M") {
    startDate = dayjs().startOf("month").subtract(6, "month").format("YYYY-MM-DD");
    endDate = dayjs().endOf("month").format("YYYY-MM-DD 23:59");
  } else if (period.value == "Y") {
    startDate = dayjs().startOf("year").format("YYYY-MM-DD");
    endDate = dayjs().endOf("year").format("YYYY-MM-DD 23:59");
  }

  const query = supabase
    .from("account_transactions")
    .select("*")
    .gte("transaction_date", startDate)
    .lte("transaction_date", endDate)
    .order("transaction_date", { ascending: false });
  if (props.account_id) {
    query.eq("account_id", props.account_id);
  }
  if (props.car_id) {
    query.eq("car_id", props.car_id);
  }
  const { data: response, error } = await query;

  if (error) {
    $toast.error(error.message);
  } else {
    data.value = response;
  }
  sumIncome.value = response
    .filter((item) => item.transaction_amount > 0)
    .reduce((acc, item) => acc + Number(item.transaction_amount), 0);
  sumExpense.value = response
    .filter((item) => item.transaction_amount < 0)
    .reduce((acc, item) => acc + Number(item.transaction_amount), 0);

  loading.value = false;
};

watch(
  () => period.value,
  () => {
    getData();
  }
);

const dialogTransaction = ref(false);
const transaction_id = ref(0);
const handleClick = (e, row) => {
  dialogTransaction.value = true;
  transaction_id.value = row.item.id;
};

// const id = ref(0);
// const dialogDelete = ref(false);
// const deleteItem = async () => {
//   loading.value = true;
//   dialogDelete.value = false;
//   const response = await useApiAccounts().destroy(id.value);
//   response.status == 200
//     ? ($toast.success("ลบสำเร็จ"), (dialog.value = false), emit("success"))
//     : $toast.error("เกิดข้อผิดพลาด! กรุณาติดต่อผู้แลระบบ");
//   loading.value = false;
// };

const onClose = () => {
  dialog.value = false;
  emit("close");
};

// Check dialog isOpen
watch(dialog, (value) => {
  if (value) {
    formTitle.value = `รายการบัญชี: ${props.number}`;
    getData();
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
