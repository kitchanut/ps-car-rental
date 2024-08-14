<template>
  <div class="login-container">
    <h1 style="margin-top: 20vh">Login</h1>
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="email">Email</label>
        <input v-model="email" placeholder="Enter your email" required />
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input v-model="password" type="password" id="password" placeholder="Enter your password" required />
      </div>
      <button type="submit">Login</button>
    </form>
  </div>
</template>

<script setup>
definePageMeta({ layout: "empty" });
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
    localStorage.setItem("token", response.data.token);
    useState("isAuthenticated", () => true);
    router.push({ path: "/" });
  } else {
    alert.value = true;
    $toast.error("ชื่อผู้ใช้ หรือ รหัสผ่าน ผิด !!");
  }
  loading.value = false;
};
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 2em;
  background: #f7f7f7;
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
