<template>
  <div class="home-container">
    <!-- Header -->
    <header class="app-header">
      <div class="header-left">
        <img src="/logo.png" alt="ByteFlow Logo" class="logo" />
        <h1 class="app-title">ByteFlow</h1>
      </div>

      <div class="header-center">
        <div class="connection-status" :class="{ connected: isConnected }">
          <span class="status-dot"></span>
          <span class="status-text">{{ isConnected ? '已连接' : '未连接' }}</span>
        </div>
      </div>

      <div class="header-right">
        <el-button @click="toggleTheme" :icon="isDark ? 'Sunny' : 'Moon'" circle size="small" />
      </div>
    </header>

    <!-- Main Content -->
    <div class="content-wrapper">
      <!-- Sidebar -->
      <aside class="sidebar">
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
      </aside>

      <!-- Main Panel -->
      <main class="main-panel">
        <!-- Terminal Area -->
        <div class="terminal-wrapper">
          <SerialReceive
            ref="receiveRef"
            :is-hex="receiveConfig.isHex"
            :show-time="receiveConfig.showTime"
            :auto-scroll="receiveConfig.autoScroll"
            :show-tx="sendConfig.showTx"
          />
        </div>

        <!-- Send Area -->
        <div class="send-wrapper">
          <SerialSend
            :is-connected="isConnected"
            :config="sendConfig"
            :rx-count="rxCount"
            :tx-count="txCount"
            @send="handleSend"
            @reset-counts="resetCounts"
          />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
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
  padding: var(--bf-space-3);
  box-sizing: border-box;
  gap: var(--bf-space-3);
  background-color: var(--bf-bg-primary);
  color: var(--bf-text-primary);
  transition: background-color var(--bf-transition-slow);
}

/* ============================================
   Header
   ============================================ */
.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: var(--bf-header-height);
  padding: 0 var(--bf-space-4);
  background: var(--bf-bg-secondary);
  border: 1px solid var(--bf-border);
  border-radius: var(--bf-radius-md);
  flex-shrink: 0;
  backdrop-filter: blur(8px);
  transition: background-color var(--bf-transition-base),
              border-color var(--bf-transition-base);
}

.header-left {
  display: flex;
  align-items: center;
  gap: var(--bf-space-3);
}

.logo {
  width: 28px;
  height: 28px;
  object-fit: contain;
}

.app-title {
  margin: 0;
  font-size: var(--bf-font-lg);
  font-weight: var(--bf-font-semibold);
  color: var(--bf-text-primary);
  font-family: var(--bf-font-mono);
  letter-spacing: -0.5px;
}

.header-center {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

.connection-status {
  display: flex;
  align-items: center;
  gap: var(--bf-space-2);
  padding: 6px 14px;
  border-radius: var(--bf-radius-full);
  font-size: var(--bf-font-sm);
  font-weight: var(--bf-font-medium);
  transition: all var(--bf-transition-base);
}

.connection-status .status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--bf-text-tertiary);
  transition: background-color var(--bf-transition-base);
}

.connection-status.connected {
  background: var(--bf-accent-green-light);
  color: var(--bf-accent-green);
  border: 1px solid rgba(63, 185, 80, 0.3);
}

.connection-status.connected .status-dot {
  background: var(--bf-accent-green);
  animation: pulse 2s ease-in-out infinite;
}

.connection-status .status-text {
  min-width: 48px;
  text-align: center;
}

.header-right {
  display: flex;
  align-items: center;
  gap: var(--bf-space-2);
}

/* ============================================
   Content Layout
   ============================================ */
.content-wrapper {
  display: flex;
  flex: 1;
  gap: var(--bf-space-3);
  min-height: 0;
  overflow: hidden;
}

/* ============================================
   Sidebar
   ============================================ */
.sidebar {
  width: var(--bf-sidebar-width);
  display: flex;
  flex-direction: column;
  gap: var(--bf-space-2);
  height: 100%;
  overflow-y: auto;
  flex-shrink: 0;
}

.sidebar-section {
  display: flex;
  flex-direction: column;
}

.sidebar-section :deep(.el-card) {
  border: 1px solid var(--bf-border);
  background: var(--bf-bg-secondary);
  border-radius: var(--bf-radius-md);
  transition: border-color var(--bf-transition-base),
              box-shadow var(--bf-transition-base);
}

.sidebar-section:last-child {
  flex: 1;
  min-height: 0;
}

.sidebar-section:last-child :deep(.el-card) {
  height: 100%;
}

.sidebar-section :deep(.el-card):hover {
  border-color: var(--bf-border-active);
}

/* ============================================
   Main Panel
   ============================================ */
.main-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--bf-space-3);
  min-width: 0;
  height: 100%;
  overflow: hidden;
}

.terminal-wrapper {
  flex: 1;
  min-height: 0;
  border-radius: var(--bf-radius-md);
  overflow: hidden;
  border: 1px solid var(--bf-border);
  background: var(--bf-log-bg);
  transition: border-color var(--bf-transition-base),
              background-color var(--bf-transition-slow);
}

.send-wrapper {
  height: 140px;
  min-height: 0;
  flex-shrink: 0;
  border-radius: var(--bf-radius-md);
  overflow: hidden;
  border: 1px solid var(--bf-border);
  background: var(--bf-bg-secondary);
  transition: border-color var(--bf-transition-base),
              background-color var(--bf-transition-slow);
}
</style>
