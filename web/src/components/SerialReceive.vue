<template>
  <div class="log-view" ref="containerRef">
    <div class="log-list">
      <div 
        v-for="(log, index) in displayLogs" 
        :key="log.id" 
        class="log-item"
        :class="log.type"
      >
        <span class="timestamp" v-if="showTime">[{{ formatTime(log.time) }}]</span>
        <span class="direction-icon">{{ log.type === 'tx' ? '»' : '«' }}</span>
        <span class="content">{{ formatContent(log.data) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'

interface LogEntry {
  id: number
  type: 'rx' | 'tx'
  data: Uint8Array
  time: number
}

const props = defineProps<{
  isHex: boolean
  showTime: boolean
  showTx: boolean
  autoScroll: boolean
}>()

const logs = ref<LogEntry[]>([])
const containerRef = ref<HTMLElement | null>(null)
let nextId = 0
const MAX_LOGS = 1000

const displayLogs = computed(() => {
  return logs.value.filter(log => {
    if (log.type === 'tx' && !props.showTx) return false
    return true
  })
})

const addLog = (type: 'rx' | 'tx', data: Uint8Array) => {
  logs.value.push({
    id: nextId++,
    type,
    data,
    time: Date.now()
  })
  
  if (logs.value.length > MAX_LOGS) {
    logs.value.shift()
  }
  
  if (props.autoScroll) {
    scrollToBottom()
  }
}

const clear = () => {
  logs.value = []
}

const scrollToBottom = () => {
  nextTick(() => {
    if (containerRef.value) {
      containerRef.value.scrollTop = containerRef.value.scrollHeight
    }
  })
}

const formatTime = (timestamp: number) => {
  const date = new Date(timestamp)
  return date.toTimeString().split(' ')[0] + '.' + date.getMilliseconds().toString().padStart(3, '0')
}

const formatContent = (data: Uint8Array) => {
  if (props.isHex) {
    return Array.from(data).map(b => b.toString(16).padStart(2, '0').toUpperCase()).join(' ')
  } else {
    // Replace non-printable characters with dot or escape code?
    // For now, use TextDecoder, but it might hide control chars.
    // Let's use TextDecoder but maybe escape newlines if they are single logs?
    // Actually, reference image shows multiline JSON.
    // So we should preserve newlines.
    try {
        return new TextDecoder().decode(data)
    } catch (e) {
        return '<Decode Error>'
    }
  }
}

defineExpose({
  addLog,
  clear
})
</script>

<style scoped>
.log-view {
  height: 100%;
  overflow-y: auto;
  background-color: #1e1e1e; /* Dark background like terminal */
  color: #cccccc;
  padding: 10px;
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 14px;
  border-radius: 4px;
}

.log-item {
  margin-bottom: 2px;
  word-break: break-all;
  white-space: pre-wrap;
  line-height: 1.4;
}

.log-item.tx {
  color: #e6db74; /* Yellowish for TX */
}

.log-item.rx {
  color: #a6e22e; /* Greenish or White for RX */
  /* Or white as per image */
  color: #f8f8f2;
}

.timestamp {
  color: #75715e;
  margin-right: 8px;
  user-select: none;
}

.direction-icon {
  margin-right: 8px;
  font-weight: bold;
  user-select: none;
}

.log-item.tx .direction-icon {
  color: #e6db74;
}

.log-item.rx .direction-icon {
  color: #66d9ef; /* Blueish for RX icon */
}
</style>
