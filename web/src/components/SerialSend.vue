<template>
  <div class="serial-send-container">
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
                <el-icon :size="24"><Promotion /></el-icon>
            </el-button>
        </div>
    </div>
    
    <div class="status-bar">
      <div class="status-left">
        <span>发送: {{ txCount }}</span>
        <span>接收: {{ rxCount }}</span>
      </div>
      <div class="status-right">
         <span v-if="config.useTimer" class="timer-status">
            <el-icon class="is-loading"><Loading /></el-icon> 定时发送中 ({{ config.timerInterval }}ms)
        </span>
        <el-link type="primary" :underline="false" @click="$emit('reset-counts')">复位计数</el-link>
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
    background-color: var(--bf-sidebar-bg); /* Use card background */
    border-radius: 4px;
    overflow: hidden;
}

.send-main {
    flex: 1;
    display: flex;
    padding: 10px;
    gap: 10px;
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
    font-family: monospace;
    resize: none;
}

.send-action {
    display: flex;
    flex-direction: column;
    width: 80px;
}

.send-btn {
    height: 100%;
    width: 100%;
    font-size: 24px;
}

.status-bar {
    height: 30px;
    background-color: var(--bf-bg-color); /* Slightly different bg */
    border-top: 1px solid var(--el-border-color-light);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 10px;
    font-size: 12px;
    color: var(--bf-text-secondary);
}

.status-left {
    display: flex;
    gap: 15px;
}

.status-right {
    display: flex;
    gap: 15px;
    align-items: center;
}

.timer-status {
    color: var(--el-color-success);
    display: flex;
    align-items: center;
    gap: 4px;
}
</style>
