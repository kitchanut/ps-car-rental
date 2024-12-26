<template>
  <div class="pa-3">
    <div class="d-flex">
      <DialogCarBrand appearance="add" actionType="add" @success="getData()" />
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

    <v-card v-for="item in data" class="mt-3" variant="outlined" style="border: 1px solid #ddd">
      <v-card-title class="d-flex justify-space-between" style="background-color: #eee">
        <div>
          <span v-if="item.car_brand_status == 'เปิดใช้งาน'">{{ item.car_brand_name }}</span>
          <s v-else>{{ item.car_brand_name }}</s>
        </div>
        <div>
          <DialogCarBrand :id="item.id" appearance="square_pecil" actionType="edit" @success="getData()" />
          <DialogCarModel
            v-if="item.car_brand_status == 'เปิดใช้งาน'"
            :car_brand_id="item.id"
            appearance="add"
            actionType="add"
            @success="getData()"
          />
        </div>
      </v-card-title>

      <div v-if="item.car_brand_status == 'เปิดใช้งาน'" v-for="model in item.car_models" :key="model.id">
        <v-divider></v-divider>
        <div class="d-flex justify-space-between px-4 py-2">
          <div>
            <DialogCarModel
              :id="model.id"
              :label="model.car_model_name"
              :status="model.car_model_status"
              appearance="button_label"
              actionType="edit"
              @success="getData()"
            />
          </div>
          <div>
            <DialogCarSubModel :car_model_id="model.id" appearance="add" actionType="add" @success="getData()" />
          </div>
        </div>
        <div v-if="model.car_sub_models.length > 0" class="px-4 pb-2">
          <DialogCarSubModel
            v-for="subModel in model.car_sub_models"
            :id="subModel.id"
            :label="subModel.car_sub_model_name"
            :status="subModel.car_sub_model_status"
            appearance="button_label"
            actionType="edit"
            @success="getData()"
          />
        </div>
      </div>
      <!-- <v-table density="compact">
        <tbody>
          <template v-for="model in item.car_models" :key="model.id">
            <tr>
              <td width="40%">
                <DialogCarModel
                  :id="model.id"
                  :label="model.car_model_name"
                  :status="model.car_model_status"
                  appearance="button_label"
                  actionType="edit"
                  @success="getData()"
                />
                <DialogCarSubModel :car_model_id="item.id" appearance="add" actionType="add" @success="getData()" />
              </td>
              <td></td>
            </tr>
            <tr>
              <DialogCarSubModel
                v-for="subModel in model.car_sub_models"
                :id="subModel.id"
                :label="subModel.car_sub_model_name"
                :status="subModel.car_sub_model_status"
                appearance="button_label"
                actionType="edit"
                @success="getData()"
              />
            </tr>
          </template>
        </tbody>
      </v-table> -->
    </v-card>

    <DialogCarBrand :dialog="dialog" :id="id" actionType="edit" @success="getData()" @close="dialog = false" />
  </div>
</template>
<script setup>
const supabase = useNuxtApp().$supabase;
const { $toast } = useNuxtApp();
const search = ref("");
const loading = ref(true);
const headers = ref([
  { title: "ยี่ห้อ", key: "car_brand_name" },
  // { title: "สถานะ", key: "car_brand_status", width: "10%" },
  // { title: "", key: "actions", width: "10%" },
]);

const data = ref([]);
const getData = async () => {
  loading.value = true;
  // const response = await useApiCarBrands().index();
  const { data: car_brands, error } = await supabase.from("car_brands").select("*, car_models(*, car_sub_models(*))");
  if (error) {
    $toast.error(error.message);
  } else {
    data.value = car_brands;
    data.value.map((item, index) => {
      item.no = index + 1;
    });
  }
  loading.value = false;
};
getData();

const dialog = ref(false);
const id = ref(0);
const handleClick = (e, row) => {
  dialog.value = true;
  id.value = row.item.id;
};
</script>
