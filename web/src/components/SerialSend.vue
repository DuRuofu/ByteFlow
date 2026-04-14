<template>
  <div class="serial-send-container">
    <!-- Send Header -->
    <div class="send-header">
      <span class="send-title">发送</span>
      <div class="send-counters">
        <span class="counter rx">
          <span class="counter-label">RX</span>
          <span class="counter-value">{{ rxCount }}</span>
        </span>
        <span class="counter tx">
          <span class="counter-label">TX</span>
          <span class="counter-value">{{ txCount }}</span>
        </span>
      </div>
    </div>

    <!-- Send Main -->
    <div class="send-main">
      <div class="input-wrapper">
        <el-input
          v-model="inputContent"
          type="textarea"
          :placeholder="config.isHex ? '请输入HEX数据，如: AA BB CC' : '请输入要发送的内容'"
          resize="none"
          class="send-input"
          @keydown.enter.prevent="handleEnter"
        />
      </div>
      <div class="send-action">
        <el-button
          class="send-btn"
          type="primary"
          @click="handleManualSend"
          :disabled="!isConnected"
        >
          <el-icon :size="20"><Promotion /></el-icon>
        </el-button>
      </div>
    </div>

    <!-- Status Bar -->
    <div class="status-bar">
      <div class="status-left">
        <span v-if="config.useTimer" class="timer-status">
          <el-icon class="is-loading"><Loading /></el-icon>
          定时 {{ config.timerInterval }}ms
        </span>
      </div>
      <div class="status-right">
        <el-link type="primary" :underline="false" @click="$emit('reset-counts')" class="reset-link">
          复位计数
        </el-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onUnmounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Loading, Promotion } from '@element-plus/icons-vue'

interface SendConfig {
    isHex: boolean
    showTx: boolean
    useTimer: boolean
    timerInterval: number
    lineEnding: string
}

const props = defineProps<{
  isConnected: boolean
  config: SendConfig
  rxCount: number
  txCount: number
}>()

const emit = defineEmits<{
  (e: 'send', data: string | Uint8Array): void
  (e: 'reset-counts'): void
}>()

const inputContent = ref('')
let timer: number | null = null

watch(() => [props.config.useTimer, props.config.timerInterval, props.isConnected], () => {
    updateTimer()
})

const updateTimer = () => {
    if (timer) {
        clearInterval(timer)
        timer = null
    }

    if (props.isConnected && props.config.useTimer && props.config.timerInterval >= 10) {
        timer = window.setInterval(() => {
            handleSend()
        }, props.config.timerInterval)
    }
}

onUnmounted(() => {
    if (timer) clearInterval(timer)
})

const handleEnter = (e: KeyboardEvent) => {
    if (e.ctrlKey) {
        handleManualSend()
    }
}

const handleManualSend = () => {
    handleSend()
}

const handleSend = () => {
  if (!inputContent.value) return
  if (!props.isConnected) return

  if (props.config.isHex) {
    const raw = inputContent.value.replace(/\s+/g, '')
    if (!/^[0-9A-Fa-f]*$/.test(raw)) {
      ElMessage.error('HEX数据格式错误')
      return
    }
    if (raw.length % 2 !== 0) {
       ElMessage.error('HEX数据长度必须是偶数')
       return
    }
    const buffer = new Uint8Array(raw.length / 2)
    for (let i = 0; i < raw.length; i += 2) {
      buffer[i / 2] = parseInt(raw.substring(i, i + 2), 16)
    }

    let finalBuffer = buffer
    if (props.config.lineEnding) {
        const suffixBytes = new TextEncoder().encode(props.config.lineEnding.replace(/\\n/g, '\n').replace(/\\r/g, '\r'))
        finalBuffer = new Uint8Array(buffer.length + suffixBytes.length)
        finalBuffer.set(buffer)
        finalBuffer.set(suffixBytes, buffer.length)
    }

    emit('send', finalBuffer)
  } else {
    const ending = props.config.lineEnding.replace(/\\n/g, '\n').replace(/\\r/g, '\r')
    emit('send', inputContent.value + ending)
  }
}
</script>

<style scoped>
.serial-send-container {
    display: flex;
    flex-direction: column;
    height: 100%;
    background: var(--bf-bg-secondary);
    transition: background-color var(--bf-transition-slow);
}

/* ============================================
   Send Header
   ============================================ */
.send-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--bf-space-2) var(--bf-space-3);
    background: var(--bf-bg-tertiary);
    border-bottom: 1px solid var(--bf-border);
    flex-shrink: 0;
}

.send-title {
    font-size: var(--bf-font-xs);
    font-weight: var(--bf-font-semibold);
    color: var(--bf-text-secondary);
    text-transform: uppercase;
    letter-spacing: 1px;
}

.send-counters {
    display: flex;
    gap: 16px;
}

.counter {
    display: flex;
    align-items: center;
    gap: 2px;
    font-size: var(--bf-font-xs);
    font-family: var(--bf-font-mono);
}

.counter-label {
    font-weight: 600;
}

.counter-value {
    min-width: 40px;
    text-align: right;
}

.counter.rx {
    color: var(--bf-accent-green);
}

.counter.tx {
    color: var(--bf-accent-cyan);
}

/* ============================================
   Send Main
   ============================================ */
.send-main {
    flex: 1;
    display: flex;
    padding: var(--bf-space-2);
    gap: var(--bf-space-2);
    min-height: 0;
}

.input-wrapper {
    flex: 1;
    display: flex;
    flex-direction: column;
}

.send-input {
    height: 100%;
}

.send-input :deep(.el-textarea__inner) {
    height: 100% !important;
    font-family: var(--bf-font-mono);
    font-size: var(--bf-font-base);
    resize: none;
    background: var(--bf-bg-primary);
    color: var(--bf-text-primary);
    border: 1px solid var(--bf-border);
    border-radius: var(--bf-radius-sm);
    transition: border-color var(--bf-transition-base),
                box-shadow var(--bf-transition-base);
}

.send-input :deep(.el-textarea__inner):focus {
    border-color: var(--bf-accent-cyan);
    box-shadow: 0 0 0 2px var(--bf-accent-cyan-light);
}

.send-input :deep(.el-textarea__inner)::placeholder {
    color: var(--bf-text-tertiary);
}

.send-action {
    display: flex;
    flex-direction: column;
    width: 64px;
}

.send-btn {
    height: 100%;
    width: 100%;
    background: linear-gradient(135deg, var(--bf-accent-cyan), #4093EE);
    border: none;
    color: white;
    transition: all var(--bf-transition-base);
}

.send-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(88, 166, 255, 0.35);
}

.send-btn:active:not(:disabled) {
    transform: translateY(0);
}

.send-btn:disabled {
    background: var(--bf-bg-tertiary);
    color: var(--bf-text-tertiary);
}

/* ============================================
   Status Bar
   ============================================ */
.status-bar {
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 var(--bf-space-3);
    background: var(--bf-bg-tertiary);
    border-top: 1px solid var(--bf-border);
    flex-shrink: 0;
}

.status-left,
.status-right {
    display: flex;
    align-items: center;
    gap: var(--bf-space-2);
}

.status-bar {
    font-size: var(--bf-font-xs);
    color: var(--bf-text-tertiary);
}

.timer-status {
    display: flex;
    align-items: center;
    gap: 4px;
    color: var(--bf-accent-orange);
}

.reset-link {
    font-size: var(--bf-font-xs);
}
</style>
