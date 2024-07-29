<template>
  <v-dialog persistent width="300" v-model="props.loading">
    <v-card color="primary">
      <v-card-text class="pt-2">
        กรุณารอสักครู่...
        <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup>
const props = defineProps({
  loading: Boolean,
});
</script>

<style scoped></style>
