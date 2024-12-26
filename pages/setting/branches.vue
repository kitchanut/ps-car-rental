<template>
  <div class="pa-3">
    <v-card variant="outlined" style="border: 1px solid #ddd">
      <div class="d-flex ma-3">
        <DialogBranch appearance="add" actionType="add" @success="getData()" />
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
        <template v-slot:item.branch_name="{ item }">
          <v-badge :color="item.branch_status == 'เปิดใช้งาน' ? 'success' : 'warning'" inline dot></v-badge>
          {{ item.branch_name }}
        </template>
        <!-- <template v-slot:item.branch_status="{ item }">
          <v-chip
            :color="item.branch_status == 'เปิดใช้งาน' ? 'success' : 'warning'"
            size="small"
            label
            text-color="white"
          >
            {{ item.branch_status }}
          </v-chip>
        </template> -->
        <!-- <template v-slot:item.actions="{ item }">
          <DialogBranch appearance="edit" actionType="edit" :id="item.id" @success="getData()" />
        </template> -->
      </v-data-table>
    </v-card>

    <DialogBranch :dialog="dialog" :id="id" actionType="edit" @success="getData()" @close="dialog = false" />
  </div>
</template>
<script setup>
const supabase = useNuxtApp().$supabase;
const { $toast } = useNuxtApp();
const search = ref("");
const loading = ref(true);
const headers = ref([{ title: "ชื่อสาขา", key: "branch_name" }]);

const data = ref([]);

const getData = async () => {
  loading.value = true;

  const { data: branches, error } = await supabase.from("branches").select("*").order("id");
  if (error) {
    $toast.error(error.message);
  } else {
    data.value = branches;
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
