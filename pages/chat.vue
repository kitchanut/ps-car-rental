<template>
  <div class="pa-3" style="height: 100%">
    <v-card
      v-if="!conversation_id"
      variant="outlined"
      style="border: 1px solid #ddd; max-width: 94vw"
      height="100%"
      :loading="loading"
    >
      <v-card-title class="pa-0">
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
        <v-fab
          class="me-0"
          icon="mdi-refresh"
          location="top end"
          size="small"
          absolute
          offset
          style="top: -25px; right: 4px"
          :loading="loading"
          @click="getConversations()"
        ></v-fab>
      </v-card-title>
      <v-divider></v-divider>

      <div v-if="conversations.length == 0" class="text-center py-10">- ไม่มีข้อมูล -</div>
      <v-list v-else color="primary">
        <v-list-item v-for="item in conversations" :value="item.id">
          <template v-slot:prepend>
            <!-- {{ isCustomer(item.senders.data[0].id) }} -->
            <DialogCustomer
              :facebook_id="item.senders.data[0].id"
              :facebook_name="item.senders.data[0].name"
              :appearance="
                isCustomer(item.senders.data[0].id)
                  ? isCustomer(item.senders.data[0].id).customer_status == 'เปิดใช้งาน'
                    ? 'editAvatar'
                    : 'inactivatAvatar'
                  : 'addAvatar'
              "
              :actionType="isCustomer(item.senders.data[0].id) ? 'edit' : 'add'"
              :id="isCustomer(item.senders.data[0].id) ? isCustomer(item.senders.data[0].id).id : null"
              @success="
                getCustomer();
                getConversations();
              "
            />
          </template>
          <v-list-item-title
            @click="
              conversation_id = item.id;
              conversation_name = item.senders.data[0].name;
              sender_id = item.senders.data[0].id;
              getMessages();
            "
          >
            {{ item.senders.data[0].name }}
            <span v-if="isCustomer(item.senders.data[0].id)" style="color: green">
              [{{ isCustomer(item.senders.data[0].id).customer_name }}]
            </span>
          </v-list-item-title>
          <v-list-item-subtitle
            @click="
              conversation_id = item.id;
              conversation_name = item.senders.data[0].name;
              sender_id = item.senders.data[0].id;
              getMessages();
            "
          >
            <div v-if="item.messages.data[0].message" v-html="item.messages.data[0].message"></div>
            <div v-else-if="item.messages.data[0].attachments">[ไฟล์/รูปภาพ]</div>
          </v-list-item-subtitle>
        </v-list-item>
      </v-list>
    </v-card>
    <v-card v-else variant="outlined" style="border: 1px solid #ddd" height="100%" :loading="loading">
      <v-card flat class="d-flex flex-column fill-height">
        <v-card-title>
          <v-btn
            icon="mdi-keyboard-backspace"
            size="small"
            variant="text"
            @click="
              getConversations();
              conversation_id = null;
            "
          ></v-btn>
          {{ conversation_name }}
        </v-card-title>

        <v-divider></v-divider>
        <div class="fill-height px-2">
          <v-row class="fill-height" align="end">
            <v-col>
              <div
                v-for="(msg, index) in messages_face"
                :key="index"
                :class="['d-flex flex-row align-center my-1', msg.from.id == page_id ? 'justify-end' : null]"
              >
                <div v-if="msg.from.id != page_id">
                  <div v-if="shouldDisplayChip(index)" class="mt-5">
                    <v-chip class="pa-2 mb-1" color="success" size="small">
                      <span>{{ conversation_name }}</span>
                    </v-chip>
                    <sub class="ml-2" style="font-size: 0.5rem">{{ $dayjs(msg.created_time).fromNow() }} </sub>
                  </div>
                  <v-card variant="outlined" class="pa-2" style="border: 1px solid #ddd; max-width: min(500px, 70vw)">
                    <p class="ml-1" v-html="msg.message" style="white-space: pre-line"></p>
                    <div v-if="msg.attachments" v-viewer>
                      <div class="d-flex flex-wrap">
                        <div v-for="file in msg.attachments.data">
                          <v-img
                            v-if="msg.attachments.data.length == 1"
                            class="rounded"
                            :src="file.image_data.url"
                            width="120px"
                          ></v-img>
                          <v-img
                            v-else
                            class="ma-1 rounded"
                            :src="file.image_data.url"
                            width="110px"
                            height="80px"
                            cover
                          ></v-img>
                        </div>
                      </div>
                    </div>
                  </v-card>
                </div>
                <div v-else>
                  <div v-if="shouldDisplayChip(index)" class="text-right mt-3 mb-1">
                    <v-chip class="pa-2" color="primary" size="small">
                      <span>คุณ</span>
                    </v-chip>
                    <sub class="ml-2" style="font-size: 0.5rem">{{ $dayjs(msg.created_time).fromNow() }}</sub>
                  </div>
                  <v-card
                    variant="outlined"
                    class="pa-2"
                    style="border: 1px solid #e4ecf7; max-width: min(500px, 70vw)"
                  >
                    <p class="mt-1" v-html="msg.message" style="white-space: pre-line"></p>
                    <div v-if="msg.attachments" v-viewer>
                      <div class="d-flex flex-wrap">
                        <div v-for="file in msg.attachments.data">
                          <v-img
                            v-if="msg.attachments.data.length == 1"
                            class="rounded"
                            :src="file.image_data.url"
                            width="120px"
                          ></v-img>
                          <v-img
                            v-else
                            class="ma-1 rounded"
                            :src="file.image_data.url"
                            width="110px"
                            height="80px"
                            cover
                          ></v-img>
                        </div>
                      </div>
                    </div>
                  </v-card>
                </div>
              </div>
            </v-col>
          </v-row>
        </div>
        <div class="pa-3 d-flex">
          <v-textarea
            v-model="messageSend"
            rows="1"
            auto-grow
            class="pr-2"
            rounded
            density="comfortable"
            placeholder="ข้อความ"
            variant="outlined"
            hide-details=""
          ></v-textarea>
          <v-btn
            color="primary"
            icon="mdi-message-text-fast-outline"
            variant="tonal"
            @click="sendMessage()"
            :loading="loading"
          ></v-btn>
        </div>
      </v-card>
    </v-card>
  </div>
</template>
<script setup>
import axios from "axios";
const route = useRoute();
const { $toast } = useNuxtApp();
const conversation_id = useState("conversation_id", () => null);
const conversation_name = useState("conversation_name", () => null);

const loading = ref(false);
const pages = useState("pages", () => []);

// const page_id = ref(null);
const page_id = useState("page_id", () => null);
const page_access_token = useState("page_access_token", () => null);
const getPage = async () => {
  // loading.value = true;
  const response = await useApiFacebookPages().index();
  pages.value = response.data;
  // loading.value = false;
};
getPage();

// const getProfilePicture = (senderId) => {
//   const profileUrl = `https://graph.facebook.com/v20.0/${senderId}/picture?redirect=false&access_token=${page_access_token.value}`;
//   axios
//     .get(profileUrl)
//     .then((response) => {
//       const profileImageUrl = response.data.data.url;
//       console.log("Profile Image URL:", profileImageUrl);
//     })
//     .catch((error) => {
//       console.error("Error fetching profile image:", error);
//     });
// };

// const conversations = ref([]);
onMounted(() => {
  if (page_id.value && !conversation_id.value) {
    getConversations();
  } else if (page_id.value && conversation_id.value) {
    getMessages();
  }
});
const conversations = useState("conversations", () => []);
const getConversations = async () => {
  try {
    loading.value = true;
    let pageSelect = pages.value.find((page) => page.page_id == page_id.value);
    page_access_token.value = pageSelect.page_access_token;
    const response = await axios({
      method: "GET",
      url: `https://graph.facebook.com/v20.0/${pageSelect.page_id}?fields=conversations{senders,unread_count,messages.limit(1){message,attachments}}&access_token=${page_access_token.value}`,
    });
    conversations.value = response.data.conversations.data;
    loading.value = false;
  } catch (error) {
    console.log(error);
    if (error.response.data.error.code == 2 || error.response.data.error.code == 190) {
      $toast.error("เกิดข้อผิดพลาด! กรุณาเพิ่มเพจใหม่อีกครั้งในหน้าตั้งค่าเพจ");
    } else {
      $toast.error("เกิดข้อผิดพลาด! Code: " + error.response.data.error.code);
    }
    loading.value = false;
  }
};

const messages_face = useState("messages_face", () => []);
const getMessages = async () => {
  try {
    loading.value = true;
    // let pageSelect = pages.value.find((page) => page.page_id == page_id.value);
    const response = await axios({
      method: "GET",
      url: `https://graph.facebook.com/v20.0/${conversation_id.value}?fields=messages{from,message,attachments,created_time}&access_token=${page_access_token.value}`,
    });

    messages_face.value = response.data.messages.data;
    messages_face.value.sort((a, b) => new Date(a.created_time) - new Date(b.created_time));
    // console.log("messages_face:", messages_face.value);
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

const sender_id = ref(null);
const messageSend = ref(null);
const sendMessage = async () => {
  if (!messageSend.value) return;
  loading.value = true;
  const pageId = page_id.value;
  const psid = sender_id.value;
  const accessToken = page_access_token.value;

  const url = `https://graph.facebook.com/v20.0/${pageId}/messages`;

  const recipient = {
    id: psid,
  };
  const message = {
    text: messageSend.value,
  };

  const response = await useFetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      recipient,
      messaging_type: "RESPONSE",
      message,
      access_token: accessToken,
    }),
  });
  messageSend.value = "";
  getMessages();
};

const customers = ref([]);
const getCustomer = async () => {
  const response = await useApiCustomers().index();
  // console.log(response.data);
  customers.value = response.data;
};
getCustomer();

const isCustomer = (facebook_id) => {
  return customers.value.find((customer) => customer.facebook_id == facebook_id);
};

const dayjs = useDayjs();
const shouldDisplayChip = (index) => {
  if (index == 0) return true;
  if (messages_face.value[index].from.id != messages_face.value[index - 1].from.id) return true;
  if (
    dayjs(messages_face.value[index].created_time).diff(dayjs(messages_face.value[index - 1].created_time), "minute") >
    5
  )
    return true;
  return false;
};
</script>
<style scoped>
.v-chip__content {
  display: inline !important;
}
</style>
