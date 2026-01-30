<template>
  <el-card class="serial-send" :body-style="{ padding: '10px', height: '100%', display: 'flex', flexDirection: 'column' }">
    <template #header>
      <div class="card-header">
        <span>发送区</span>
        <el-button type="primary" size="small" @click="handleManualSend" :disabled="!isConnected">发送</el-button>
      </div>
    </template>
    
    <div class="input-area">
        <el-input
        v-model="inputContent"
        type="textarea"
        :rows="4"
        :placeholder="config.isHex ? '请输入HEX数据，如: AA BB CC' : '请输入要发送的内容'"
        resize="none"
        class="send-input"
        @keydown.enter.prevent="handleEnter" 
        />
    </div>
    
    <div class="footer-tip">
      <span>Ctrl+Enter 发送</span>
      <span v-if="config.useTimer" class="timer-status">
          <el-icon class="is-loading"><Loading /></el-icon> 定时发送中 ({{ config.timerInterval }}ms)
      </span>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { ref, watch, onUnmounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Loading } from '@element-plus/icons-vue'

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
}>()

const emit = defineEmits<{
  (e: 'send', data: string | Uint8Array): void
}>()

const inputContent = ref('')
let timer: number | null = null

// Handle timer
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
    // Parse Hex
    const raw = inputContent.value.replace(/\s+/g, '')
    if (!/^[0-9A-Fa-f]*$/.test(raw)) {
      ElMessage.error('HEX数据格式错误')
      // If timer is running, maybe stop it or just ignore?
      // Let's just ignore for now to avoid spamming errors
      if (timer) {
          // clearInterval(timer)
          // props.config.useTimer = false // Can't mutate prop
      }
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
    
    // Append line ending to Hex?
    // As per previous logic:
    let finalBuffer = buffer
    if (props.config.lineEnding) {
        const suffixBytes = new TextEncoder().encode(props.config.lineEnding.replace(/\\n/g, '\n').replace(/\\r/g, '\r'))
        finalBuffer = new Uint8Array(buffer.length + suffixBytes.length)
        finalBuffer.set(buffer)
        finalBuffer.set(suffixBytes, buffer.length)
    }
    
    emit('send', finalBuffer)
  } else {
    // Text mode
    // Handle escape characters in input? Standard text area doesn't process \n as escape.
    // But lineEnding option does.
    const ending = props.config.lineEnding.replace(/\\n/g, '\n').replace(/\\r/g, '\r')
    emit('send', inputContent.value + ending)
  }
}
</script>

<style scoped>
.serial-send {
    height: 100%;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.input-area {
    flex: 1;
    display: flex;
    flex-direction: column;
}
.send-input {
    flex: 1;
}
.send-input :deep(.el-textarea__inner) {
    height: 100% !important;
    font-family: monospace;
}
.footer-tip {
  margin-top: 5px;
  font-size: 12px;
  color: var(--bf-text-secondary);
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.timer-status {
    color: var(--el-color-success);
    display: flex;
    align-items: center;
    gap: 4px;
}
</style>
