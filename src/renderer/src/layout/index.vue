<template>
  <div>
    <el-button type="primary" @click="onJump('Home')">页面1</el-button>
    <el-button type="primary" @click="onJump('Notice')">页面2</el-button>
  </div>
  <div>
    <RouterView></RouterView>
  </div>
</template>
<script setup lang="ts">
import { useRouter } from 'vue-router'
const router = useRouter()
const onJump = (name: string) => {
  router.push({ name })
}
</script>
