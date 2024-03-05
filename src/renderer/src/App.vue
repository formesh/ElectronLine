<script setup lang="ts">
import Versions from './components/Versions.vue'

const ipcHandle = () => window.electron.ipcRenderer.send('ping')
const ipcHandleAdd = () => {
  window.electron.ipcRenderer.send('ipcHandleAdd')
}
const ipcHandleAdd1 = () => {
  window.electron.ipcRenderer.send('ipcHandleAdd1')
}
import zhCn from 'element-plus/dist/locale/zh-cn'
const locale = zhCn
</script>

<template>
  <!-- <el-config-provider :locale="locale">
    <RouterView></RouterView>
  </el-config-provider> -->
  <img alt="logo" class="logo" src="./assets/electron.svg" />
  <div class="creator">Powered by electron-vite</div>
  <div class="text">
    Build an Electron app with
    <span class="vue">Vue</span>
    and
    <span class="ts">TypeScript</span>
  </div>
  <el-button type="primary">Primary</el-button>
  <p class="tip">Please try pressing <code>F12</code> to open the devTool</p>
  <div class="actions">
    <div class="action">
      <a href="https://electron-vite.org/" target="_blank" rel="noreferrer">Documentation</a>
    </div>
    <div class="action">
      <a target="_blank" rel="noreferrer" @click="ipcHandle">Send IPC</a>
    </div>
    <div class="action">
      <a target="_blank" rel="noreferrer" @click="ipcHandleAdd">Add</a>
      <a target="_blank" rel="noreferrer" @click="ipcHandleAdd1">Add1</a>
    </div>
  </div>
  <Versions />
</template>
