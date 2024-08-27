<template>
  <div>
    <h1>Login with Facebook</h1>
    <v-btn @click="loginWithFacebook">Login with Facebook</v-btn>
  </div>
</template>
<script setup>
const router = useRouter();

const loginWithFacebook = () => {
  FB.login(
    function (response) {
      if (response.authResponse) {
        const accessToken = response.authResponse.accessToken;
        // คุณสามารถใช้ accessToken นี้ในการเรียก API ต่างๆ
        console.log("Access Token:", accessToken);
        // router.push("/select-page");
      } else {
        console.error("User cancelled login or did not fully authorize.");
      }
    },
    { scope: "pages_show_list,pages_messaging,pages_read_engagement,pages_manage_conversations" }
  );
};
</script>
