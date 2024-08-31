<template>
  <div class="pa-3" style="height: 100%">
    <v-card
      v-if="!conversation_id"
      variant="outlined"
      style="border: 1px solid #ddd; max-width: 94vw"
      height="100%"
      :loading="loading"
    >
      <v-card-title primary-title>
        <v-select
          v-model="page_id"
          :items="pages"
          item-title="page_name"
          item-value="page_id"
          placeholder="กรุณาเลือกเพจ"
          density="comfortable"
          hide-details
          @update:modelValue="getConversations()"
        ></v-select>
      </v-card-title>
      <v-divider></v-divider>
      <div v-if="conversations.length == 0" class="text-center py-10">- ไม่มีข้อมูล -</div>
      <v-list v-else color="primary">
        <v-list-item
          v-for="item in conversations"
          :value="item.id"
          @click="getMessages(item.id, item.senders.data[0].name)"
        >
          <template v-slot:prepend="{ item }">
            <v-avatar>
              <v-icon>mdi-account</v-icon>
            </v-avatar>
          </template>
          <v-list-item-title>
            {{ item.senders.data[0].name }}
          </v-list-item-title>
          <v-list-item-subtitle>
            <div v-if="item.messages.data[0].message" v-html="item.messages.data[0].message"></div>
            <div v-else-if="item.messages.data[0].attachments">[ไฟล์/รูปภาพ]</div>
          </v-list-item-subtitle>
        </v-list-item>
      </v-list>
    </v-card>
    <v-card v-else variant="outlined" style="border: 1px solid #ddd" height="100%" :loading="loading">
      <v-card flat class="d-flex flex-column fill-height">
        <v-card-title
          ><v-btn icon="mdi-keyboard-backspace" size="small" variant="text" @click="conversation_id = null"></v-btn>
          {{ conversation_name }}
        </v-card-title>
        <v-divider></v-divider>
        <div class="fill-height px-2">
          <v-row class="fill-height" align="end">
            <v-col>
              <div
                v-for="(msg, index) in messages_face"
                :key="index"
                :class="['d-flex flex-row align-center my-2', msg.from.id == page_id ? 'justify-end' : null]"
              >
                <v-card
                  v-if="msg.from.id != page_id"
                  variant="outlined"
                  class="pa-3"
                  style="border: 1px solid #ddd; max-width: min(500px, 70vw)"
                >
                  <v-chip class="pa-2" color="success" size="small">
                    <span>{{ conversation_name }}</span>
                  </v-chip>
                  <sub class="ml-2" style="font-size: 0.5rem">{{ $dayjs(msg.created_time).fromNow() }}</sub>
                  <p class="mt-1 ml-1" v-html="msg.message" style="white-space: pre-line"></p>
                  <div v-if="msg.attachments" v-viewer>
                    <v-img v-for="file in msg.attachments.data" class="mt-1" :src="file.image_data.url"></v-img>
                  </div>
                </v-card>
                <v-card
                  v-else
                  variant="outlined"
                  class="pa-3"
                  style="border: 1px solid #ddd; max-width: min(500px, 70vw)"
                >
                  <div class="text-right">
                    <v-chip class="pa-2" color="primary" size="small">
                      <span>คุณ</span>
                    </v-chip>
                    <sub class="ml-2" style="font-size: 0.5rem">{{ $dayjs(msg.created_time).fromNow() }}</sub>
                  </div>
                  <p class="mt-1" v-html="msg.message" style="white-space: pre-line"></p>
                  <div v-if="msg.attachments" v-viewer>
                    <v-img
                      v-for="file in msg.attachments.data"
                      class="mt-1"
                      :src="file.image_data.url"
                      width="100%"
                      height="200"
                    ></v-img>
                  </div>
                </v-card>
              </div>
            </v-col>
          </v-row>
        </div>
      </v-card>
    </v-card>
  </div>
</template>
<script setup>
import axios from "axios";
const { $toast } = useNuxtApp();
const conversation_id = ref(null);
const conversation_name = ref(null);

const loading = ref(false);
const pages = ref([]);
const page_id = ref(null);
const getPage = async () => {
  loading.value = true;
  const response = await useApiFacebookPages().index();
  pages.value = response.data;
  loading.value = false;
};
getPage();
const conversations = ref([]);
const getConversations = async () => {
  try {
    loading.value = true;
    let pageSelect = pages.value.find((page) => page.page_id == page_id.value);
    const response = await axios({
      method: "GET",
      url: `https://graph.facebook.com/v20.0/${pageSelect.page_id}?fields=conversations{senders,unread_count,messages.limit(1){message,attachments}}&access_token=${pageSelect.page_access_token}`,
    });
    conversations.value = response.data.conversations.data;
    loading.value = false;
  } catch (error) {
    console.log(error.response.data.error);
    if (error.response.data.error.code == 2 || error.response.data.error.code == 190) {
      $toast.error("เกิดข้อผิดพลาด! กรุณาเพิ่มเพจใหม่อีกครั้งในหน้าตั้งค่าเพจ");
    } else {
      $toast.error("เกิดข้อผิดพลาด! Code: " + error.response.data.error.code);
    }
    loading.value = false;
  }
};

const messages_face = ref([]);
const getMessages = async (id, name) => {
  conversation_id.value = id;
  conversation_name.value = name;
  messages_face.value = [];
  try {
    loading.value = true;
    let pageSelect = pages.value.find((page) => page.page_id == page_id.value);
    const response = await axios({
      method: "GET",
      url: `https://graph.facebook.com/v20.0/${id}?fields=messages{from,message,attachments,created_time}&access_token=${pageSelect.page_access_token}`,
    });

    messages_face.value = response.data.messages.data;
    messages_face.value.sort((a, b) => new Date(a.created_time) - new Date(b.created_time));
    console.log("messages_face:", messages_face.value);
    loading.value = false;
  } catch (error) {
    console.log(error.response.data.error);
    if (error.response.data.error.code == 2 || error.response.data.error.code == 190) {
      $toast.error("เกิดข้อผิดพลาด! กรุณาเพิ่มเพจใหม่อีกครั้งในหน้าตั้งค่าเพจ");
    } else {
      $toast.error("เกิดข้อผิดพลาด! Code: " + error.response.data.error.code);
    }
    loading.value = false;
  }
};

const activeChat = ref(1);
const messageForm = ref({ content: "", me: true, created_at: "11:11am" });
</script>
<style scoped>
.v-chip__content {
  display: inline !important;
}
</style>
