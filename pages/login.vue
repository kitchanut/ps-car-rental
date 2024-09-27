<template>
  <v-container class="login-container">
    <h1 style="margin-top: 20vh">PSCarRental</h1>
    <form @submit.prevent="handleSubmit">
      <v-text-field
        prepend-inner-icon="mdi-account"
        single-line
        type="text"
        placeholder="ชื่อผู้ใช้งาน/อีเมล์"
        v-model="email"
        dense
        outlined
      ></v-text-field>
      <v-text-field
        prepend-inner-icon="mdi-key-variant"
        single-line
        type="password"
        placeholder="รหัสผ่าน"
        v-model="password"
        dense
        outlined
      ></v-text-field>
      <v-btn
        block
        type="submit"
        class="pt-5 pb-5"
        :loading="loading"
        :disabled="loading"
        variant="tonal"
        size="x-large"
      >
        เข้าสู่ระบบ
        <template v-slot:loader>
          <Icon name="svg-spinners:3-dots-move" size="2em" />
        </template>
      </v-btn>
    </form>
  </v-container>
</template>

<script setup>
definePageMeta({ layout: "home" });
const { $toast } = useNuxtApp();
const router = useRouter();

const email = ref("");
const password = ref("");
const loading = ref(false);
const handleSubmit = async () => {
  loading.value = true;
  const data = {
    email: email.value,
    password: password.value,
  };
  const response = await useApiUsers().login(data);
  if (response.status) {
    useCookie("user").value = response.data.user;
    useCookie("token").value = response.data.token;
    useCookie("isLogin").value = true;
    router.push({ path: "/dashboard" });
  } else {
    alert.value = true;
    $toast.error("ชื่อผู้ใช้ หรือ รหัสผ่าน ผิด !!");
  }
  loading.value = false;
};
</script>

<style scoped>
.login-container {
  max-width: 500px !important;
  margin: 0 auto;
  padding: 2em;
  /* background: #f7f7f7; */
  border-radius: 8px;
  height: 100vh;
}

h1 {
  text-align: center;
  margin-bottom: 1em;
}

.form-group {
  margin-bottom: 1em;
}

label {
  display: block;
  margin-bottom: 0.5em;
}

input {
  width: 100%;
  padding: 0.5em;
  margin-top: 0.25em;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  width: 100%;
  padding: 0.75em;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}
</style>
