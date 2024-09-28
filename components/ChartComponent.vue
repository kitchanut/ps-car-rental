<template>
  <div ref="chart" style="width: 99%; height: 400px"></div>
</template>

<script setup>
const props = defineProps({
  series: Array,
  xAxis: Object,
});
const chart = ref(null);
const { $echarts } = useNuxtApp();

watch(
  () => props.series,
  () => {
    initChart();
  }
);
onMounted(() => {
  initChart();
});
const initChart = () => {
  const chartInstance = $echarts.init(chart.value);
  const option = {
    tooltip: {
      trigger: "axis",
    },
    xAxis: props.xAxis,
    yAxis: {
      type: "value",
    },
    series: props.series,
  };
  chartInstance.setOption(option);
};
</script>
