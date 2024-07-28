<template>
  <div>Users</div>
</template>
<script setup>
const { data } = await useFetch("/api/users");
console.log(data.value);
</script>
