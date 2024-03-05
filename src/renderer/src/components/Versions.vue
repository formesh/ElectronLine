<script setup lang="ts">
import { reactive } from 'vue'

const versions = reactive({ ...window.electron.process.versions })
const closeWin = (name: string) => {
  window.electron.ipcRenderer.send('CloseWin', name)
}
</script>

<template>
  <ul class="versions">
    <li class="electron-version">Electron v{{ versions.electron }}</li>
    <li class="chrome-version">Chromium v{{ versions.chrome }}</li>
    <li class="node-version">Node v{{ versions.node }}</li>
    <li class="node-version" @click="closeWin('win1')">关闭1</li>
    <li class="node-version" @click="closeWin('win2')">关闭2</li>
  </ul>
</template>
