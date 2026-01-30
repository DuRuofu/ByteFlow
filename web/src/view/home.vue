<template>
  <div class="home-container">
    <div class="header">
        <div class="logo-container">
            <img src="/logo.png" alt="ByteFlow Logo" class="logo" />
            <h1 class="app-title">ByteFlow</h1>
        </div>
        <div class="header-actions">
            <el-button @click="toggleTheme" :icon="isDark ? 'Sunny' : 'Moon'" circle size="small" />
        </div>
    </div>

    <div class="content-wrapper">
        <div class="sidebar">
        <div class="sidebar-section">
            <SerialConfig 
            :is-connected="isConnected" 
            :has-port="!!port"
            @select-port="requestPort"
            @open="handleOpen"
            @close="closePort"
            @signals-change="setSignals"
            />
        </div>
        
        <div class="sidebar-section">
            <ReceiveSettings 
                v-model="receiveConfig" 
                @clear="clearReceive" 
                @save="saveReceive" 
            />
        </div>

        <div class="sidebar-section">
            <SendSettings v-model="sendConfig" />
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
                :rx-count="rxCount"
                :tx-count="txCount"
                @send="handleSend" 
                @reset-counts="resetCounts"
            />
        </div>
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

const { port, isConnected, requestPort, openPort, closePort, send, onData, setSignals, rxCount, txCount, resetCounts } = useSerial()
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
  flex-direction: column;
  height: 100vh;
  padding: 10px;
  box-sizing: border-box;
  gap: 10px;
  background-color: var(--bf-bg-color);
  color: var(--bf-text-color);
  transition: background-color 0.3s;
}

.content-wrapper {
    display: flex;
    flex: 1;
    gap: 10px;
    min-height: 0; /* Important for scrolling */
}

.sidebar {
  width: 280px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  height: 100%;
  overflow-y: auto;
}

.sidebar-section {
    /* Natural height */
    display: flex;
    flex-direction: column;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 0; /* Prevent flex overflow */
  height: 100%;
}

.header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 10px;
    height: 40px; /* Approximate logo height + padding */
    flex-shrink: 0;
}

.logo-container {
    display: flex;
    align-items: center;
    gap: 15px;
    margin-left: 50px; /* Shift to right, approx middle of 280px sidebar */
}

.logo {
    width: 40px; /* Increased from 30px */
    height: 40px; /* Increased from 30px */
    object-fit: contain;
}

.app-title {
    margin: 0;
    font-size: 1.4rem; /* Slightly larger text to match logo */
    font-weight: bold;
    color: var(--bf-text-color);
}

.receive-area {
  flex: 1;
  min-height: 0; /* Allow scrolling inside */
  background-color: var(--bf-code-bg);
  border-radius: 4px;
  overflow: hidden;
}

.send-area {
  height: 150px; /* Reduced from 200px */
  min-height: 0;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
}
</style>
