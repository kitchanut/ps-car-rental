<template>
  <v-dialog v-model="dialogDeleteComponent" max-width="500">
    <v-card>
      <v-toolbar color="red" dark flat dense style="font-size: 20px" height="6"> </v-toolbar>
      <h3 class="text-center" style="font-size: 22px; margin: 10px">ยืนยันการลบ ?</h3>
      <v-divider></v-divider>
      <v-card-text class="mt-5 text-center" style="font-size: 18px; margin-bottom: 40px">
        <p>ลบแล้วไม่สามารถกู้ข้อมูลได้ !</p>
        <p>กรุณากรอกคำว่า <b>"delete" </b> เพื่อยืนยัน</p>
        <br />
        <v-row class="d-flex justify-center">
          <v-col cols="8"
            ><v-text-field color="red" v-model="confirmText" single-line outlined dense hide-details></v-text-field
          ></v-col>
        </v-row>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn color="red darken-1" @click="cancleDelete()" variant="text">
          <v-icon left>mdi-close</v-icon>ยกเลิก
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn
          color="green darken-1"
          variant="text"
          :disabled="confirmText == 'delete' ? false : true"
          @click="deleteItem()"
        >
          <v-icon left>mdi-check</v-icon>ยืนยัน
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
const props = defineProps({ dialogDelete: Boolean, deleteType: String });
const emit = defineEmits(["cancleItem", "deleteItem"]);
const dialogDeleteComponent = computed(() => props.dialogDelete);
const confirmText = ref("");

// Check dialog isOpen
watch(dialogDeleteComponent, (value) => {
  if (value) {
    confirmText.value = "";
  }
});

const cancleDelete = () => emit("cancleItem");
const deleteItem = () => emit("deleteItem", props.deleteType);
</script>

<style scoped></style>
