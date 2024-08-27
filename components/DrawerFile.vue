<template>
  <v-navigation-drawer v-model="drawer" temporary style="height: 100%" width="300">
    <v-progress-linear v-if="loading" indeterminate color="yellow-darken-2"></v-progress-linear>
    <v-btn style="position: absolute; top: 2px; right: 2px" variant="text" icon="mdi-close" @click="close()"> </v-btn>

    <v-card-text style="flex-grow: 1; overflow: auto">
      <h1>รูปภาพ ({{ images.length }})</h1>
      <v-row no-gutters v-viewer>
        <v-col cols="4 px-1 mb-2" v-for="image in images" :key="image.id">
          <v-card style="height: 70px" variant="text">
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
          <v-card variant="outlined" height="70" style="border: 1px solid #ddd">
            <ImageUpload
              :car_id="myProps.id"
              :type="myProps.type"
              location="cars"
              :loading="loadingImage"
              @success="getData()"
            />
          </v-card>
        </v-col>
      </v-row>
      <br />
      <h1>ไฟล์ ({{ files.length }})</h1>
      <v-list-item v-for="file in files" :key="file.id" :value="file.id" class="py-0 px-0" style="min-height: 0px">
        <v-list-item-title>
          <v-btn class="mr-1" color="primary" icon="mdi-file" density="comfortable" size="small" variant="text">
          </v-btn>
          <a :href="$getImage(file.file_path)" target="_blank">
            {{ file.file_name }}
          </a>
        </v-list-item-title>
        <template v-slot:append>
          <v-btn
            color="red"
            icon="mdi-delete"
            density="comfortable"
            size="small"
            variant="tonal"
            @click="
              dialogDelete = true;
              imageId = file.id;
            "
          >
          </v-btn>
        </template>
      </v-list-item>
    </v-card-text>

    <DialogDelete :dialogDelete="dialogDelete" @cancleItem="dialogDelete = false" @deleteItem="deleteItem" />
  </v-navigation-drawer>
</template>

<script setup>
const { $toast } = useNuxtApp();
const emit = defineEmits(["success", "close"]);
const drawer = ref(false);
const myProps = defineProps({
  drawer: Boolean,
  id: Number,
  type: String,
});

const loadingImage = ref(false);
const loading = ref(false);
const images = ref([]);
const files = ref([]);
const getData = async () => {
  loading.value = true;
  images.value = [];
  files.value = [];
  const response = await useApiUploads().index(myProps.id, myProps.type);
  await response.data.map((item) => {
    const extension = item.extension.split("/");
    if (extension[0] == "image") {
      images.value.push(item);
    } else {
      files.value.push(item);
    }
  });
  loading.value = false;
};

const imageId = ref(0);
const dialogDelete = ref(false);
const deleteItem = async () => {
  dialogDelete.value = false;
  const response = await useApiUploads().destroy(imageId.value);
  response.status == 200 ? $toast.success("ลบสำเร็จ") : $toast.error("เกิดข้อผิดพลาด! กรุณาติดต่อผู้แลระบบ");
  getData();
  console.log(images.value.length);
  if (images.value.length == 0) {
    emit("success");
  }
};

const close = async () => {
  drawer.value = false;
  emit("close");
};
// Check dialog isOpen
watch(myProps, (value) => {
  if (value.drawer) {
    drawer.value = true;
    getData();
  }
});

watch(drawer, (value) => {
  if (!value) {
    emit("close");
  }
});
</script>
