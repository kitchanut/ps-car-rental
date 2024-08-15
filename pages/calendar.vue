<template>
  <div>
    <div class="outer" style="border-bottom: 1px solid #ccc">
      <div class="inner" :style="`width: ${innerWidth - 100};`">
        <v-table density="compact" style="line-height: 1.1">
          <thead>
            <tr>
              <th class="text-center fix" style="font-size: 1.1rem">
                <div style="padding-top: 10px">รายการรถ</div>
              </th>
              <th class="text-center header">
                {{ $dayjs().add(-2, "day").format("MMM D") }}
              </th>
              <th class="text-center">{{ $dayjs().add(-1, "day").format("MMM D") }}</th>
              <th class="text-center header" style="color: #1966c0; font-weight: 700">
                {{ $dayjs().format("MMM D") }}
              </th>
              <th class="text-center header" v-for="n in 100">{{ $dayjs().add(n, "day").format("MMM D") }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in 10">
              <td class="fix" style="padding: 0px">
                <div class="d-flex">
                  <div style="border-right: 1px solid #ccc; padding: 5px 5px; min-width: 75px; text-align: center">
                    <div class=""><b>5กว 3472</b></div>
                    <div style="font-size: 0.7rem">นครพนม</div>
                  </div>
                  <div class="vertical-text px-1">2023</div>
                  <div class="text-center" style="border-left: 1px solid #ccc; padding: 5px 5px; width: 100%">
                    <div><b>Altis</b></div>
                    <div style="color: green; font-size: 0.7rem">1,290</div>
                  </div>
                </div>
              </td>
              <td align="center"></td>
              <td align="center">
                <v-btn
                  color="warning"
                  variant="tonal"
                  density="compact"
                  style="min-width: 40px; height: 100%; padding: 0px"
                >
                  จอง
                </v-btn>
              </td>
              <td align="center"></td>
              <td align="center" v-for="n in 100"></td>
            </tr>
          </tbody>
        </v-table>
      </div>
    </div>
  </div>
</template>
<script setup>
const innerWidth = ref(window.innerWidth);
</script>
<style scoped>
.header {
  width: 200px !important;
}

th {
  padding: 0px 5px !important;
  min-width: 40px !important;
}

td {
  padding: 0px !important;
}
.fix {
  position: absolute;
  margin-left: -170px;
  width: 170px;
  border-right: 1px solid #ccc;
}
.outer {
  position: relative;
}
.inner {
  overflow-x: scroll;
  overflow-y: visible;
  margin-left: 170px;
}
td + td {
  border-right: 1px solid #ccc;
}
th + th {
  border-right: 1px solid #ccc;
}
.border-right {
  border-right: 1px solid #ccc;
}
</style>
