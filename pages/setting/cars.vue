<template>
  <div class="pa-3">
    <div class="d-flex">
      <DialogCar appearance="add" actionType="add" @success="getData()" />
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
    <v-data-iterator class="mt-3" :items="data" :items-per-page="10" :search="search">
      <template v-slot:default="{ items, isExpanded, toggleExpand }">
        <v-card v-for="item in items" class="mb-3" border flat>
          <v-row no-gutters>
            <v-col cols="3">
              <v-card variant="text" height="100%" style="border-radius: 0px !important">
                <v-img
                  v-if="item.raw.uploads.length"
                  height="77px"
                  cover
                  :src="$getImage(item.raw.uploads[0].file_path)"
                  v-viewer
                >
                  <v-btn
                    style="position: absolute; top: 2px; left: 2px"
                    size="small"
                    density="compact"
                    dark
                    :icon="drawer ? 'mdi-chevron-left' : 'mdi-chevron-right'"
                    @click="
                      drawer = !drawer;
                      id = item.raw.id;
                    "
                  >
                  </v-btn>
                </v-img>
                <ImageUpload
                  v-else
                  :id="item.raw.id"
                  type="car"
                  accept="image/*"
                  location="cars"
                  @success="getData()"
                />
              </v-card>
            </v-col>
            <v-col>
              <div class="d-flex">
                <div
                  @click="
                    dialog = true;
                    id = item.raw.id;
                  "
                  style="
                    border-left: 1px solid #ccc;
                    border-right: 1px solid #ccc;
                    padding: 5px 5px;
                    width: 100px;
                    text-align: center;
                  "
                >
                  <div style="color: #1966c0">
                    <b>{{ item.raw.license_plate }}</b>
                  </div>
                  <div style="font-size: 0.7rem">{{ item.raw.license_plate_province }}</div>

                  <div>
                    <v-chip color="primary" label density="compact" size="small">
                      {{ item.raw.branch.branch_name }}
                    </v-chip>
                  </div>
                </div>
                <div class="vertical-text px-1">{{ item.raw.year }}</div>
                <div class="text-center" style="border-left: 1px solid #ccc; padding: 5px 5px; width: 55%">
                  <div>
                    <b>{{ item.raw.car_model.car_model_name }}</b>
                  </div>
                  <div style="color: green; font-size: 0.8rem">
                    <b>{{ item.raw.rental_per_day.toLocaleString() }}</b>
                    | {{ item.raw.driver_per_day.toLocaleString() }} | {{ item.raw.deposit.toLocaleString() }}
                  </div>
                  <v-chip
                    v-if="item.raw.car_sub_model"
                    class="mr-1"
                    color="warning"
                    label
                    density="compact"
                    size="small"
                  >
                    {{ item.raw.car_sub_model.car_sub_model_name }}
                  </v-chip>
                  <v-chip label density="compact" size="small">
                    {{ item.raw.color }}
                  </v-chip>
                </div>
              </div>
            </v-col>
          </v-row>

          <v-divider v-if="isExpanded(item)"></v-divider>
          <v-expand-transition>
            <div v-if="isExpanded(item)" class="wrapper pa-1">
              <div class="item" v-for="image in item.raw.uploads" :key="image.id">
                <v-img
                  class="mr-1"
                  height="77"
                  style="border-radius: 6px"
                  cover
                  :src="$getImage(image.file_path)"
                  :lazy-src="$getImage(image.file_path)"
                >
                  <v-btn
                    style="position: absolute; top: 2px; right: 2px"
                    color="red"
                    size="small"
                    density="compact"
                    dark
                    icon="mdi-delete"
                    @click="
                      dialogDelete = true;
                      deleteType = 'image';
                      imageId = image.id;
                    "
                  >
                  </v-btn>
                </v-img>
              </div>
              <div class="item">
                <v-card border flat height="100%">
                  <ImageUpload :id="item.raw.id" type="car" location="cars" @success="getData()" />
                </v-card>
              </div>
            </div>
          </v-expand-transition>
        </v-card>
      </template>
    </v-data-iterator>
    <DialogCar :dialog="dialog" :id="id" actionType="edit" @success="getData()" @close="dialog = false" />
    <DrawerFile :drawer="drawer" :id="id" type="car" @close="drawer = false" />
  </div>
</template>
<script setup>
const search = ref("");
const loading = ref(true);
const data = ref([]);
const getData = async () => {
  loading.value = true;
  const response = await useApiCars().index();
  // console.log(response.data);
  data.value = response.data;
  loading.value = false;
};
getData();

const id = ref(0);
const dialog = ref(false);
const drawer = ref(false);
</script>
