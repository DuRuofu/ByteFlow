<template>
  <div class="home-container">
    <div class="sidebar">
      <div class="logo-container">
         <img src="/logo.png" alt="ByteFlow Logo" class="logo" />
         <h1 class="app-title">ByteFlow</h1>
      </div>
      
      <SerialConfig 
        :is-connected="isConnected" 
        :has-port="!!port"
        @select-port="requestPort"
        @open="handleOpen"
        @close="closePort"
        @signals-change="setSignals"
      />
      
      <div class="settings-panel">
          <ReceiveSettings 
            v-model="receiveConfig" 
            @clear="clearReceive" 
            @save="saveReceive" 
          />
          <SendSettings v-model="sendConfig" />
      </div>

      <div class="about">
        <el-button @click="toggleTheme" :icon="isDark ? 'Sunny' : 'Moon'" circle size="small" style="margin-bottom: 10px;" />
        <p>Web Serial 调试助手</p>
      </div>
    </div>
    
    <div class="main-content">
      <div class="receive-area">
        <SerialReceive 
            ref="receiveRef"
            :is-hex="receiveConfig.isHex"
            :show-time="receiveConfig.showTime"
            :auto-scroll="receiveConfig.autoScroll"
            :show-tx="sendConfig.showTx"
        />
      </div>
      <div class="send-area">
        <SerialSend 
            :is-connected="isConnected" 
            :config="sendConfig"
            @send="handleSend" 
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import SerialConfig from '../components/SerialConfig.vue'
import SerialReceive from '../components/SerialReceive.vue'
import SerialSend from '../components/SerialSend.vue'
import ReceiveSettings from '../components/ReceiveSettings.vue'
import SendSettings from '../components/SendSettings.vue'
import { useSerial, type SerialOptions } from '../composables/useSerial'
import { useTheme } from '../composables/useTheme'
import { ElMessage } from 'element-plus'

const { port, isConnected, requestPort, openPort, closePort, send, onData, setSignals } = useSerial()
const { isDark, toggleTheme, initTheme } = useTheme()

const receiveRef = ref<InstanceType<typeof SerialReceive> | null>(null)

const receiveConfig = ref({
    isHex: false,
    showTime: true,
    autoScroll: true
})

const sendConfig = ref({
    isHex: false,
    showTx: true,
    useTimer: false,
    timerInterval: 1000,
    lineEnding: ''
})

// Handle data
onData((data) => {
  if (receiveRef.value) {
      receiveRef.value.addLog('rx', data)
  }
})

const handleOpen = (options: SerialOptions) => {
  openPort(options)
}

const handleSend = (data: string | Uint8Array) => {
  send(data).then(() => {
      // Add to log if success
      if (sendConfig.value.showTx && receiveRef.value) {
          let dataBytes: Uint8Array
          if (typeof data === 'string') {
              dataBytes = new TextEncoder().encode(data)
          } else {
              dataBytes = data
          }
          receiveRef.value.addLog('tx', dataBytes)
      }
  }).catch(() => {
      // Error handled in useSerial
  })
}

const clearReceive = () => {
    if (receiveRef.value) {
        receiveRef.value.clear()
    }
}

const saveReceive = () => {
    ElMessage.info('保存功能暂未实现')
}

onMounted(() => {
    initTheme()
})
</script>

<style scoped>
.home-container {
  display: flex;
  height: 100vh;
  padding: 10px;
  box-sizing: border-box;
  gap: 10px;
  background-color: var(--bf-bg-color);
  color: var(--bf-text-color);
  transition: background-color 0.3s;
}

.sidebar {
  width: 280px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow-y: auto;
}

.logo-container {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    padding: 10px;
    background-color: var(--bf-sidebar-bg);
    border-radius: 4px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    flex-shrink: 0;
    gap: 10px;
}

.logo {
    width: 30px;
    height: 30px;
    object-fit: contain;
}

.app-title {
    margin: 0;
    font-size: 1rem;
    font-weight: bold;
    color: var(--bf-text-color);
}

.settings-panel {
    display: flex;
    flex-direction: column;
    gap: 10px;
    flex: 1; /* Take remaining space or just stack */
    min-height: 0;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 0; /* Prevent flex overflow */
}

.receive-area {
  flex: 1;
  min-height: 0; /* Allow scrolling inside */
  background-color: var(--bf-code-bg);
  border-radius: 4px;
  overflow: hidden;
}

.send-area {
  height: 160px; /* Fixed height for send area */
  flex-shrink: 0;
}

.about {
  margin-top: auto;
  text-align: center;
  color: var(--bf-text-secondary);
  font-size: 0.8rem;
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
