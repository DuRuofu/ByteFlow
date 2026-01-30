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
const PACKET_TIMEOUT = 50 // ms for Hex mode packet merging
let lastRxTime = 0

const displayLogs = computed(() => {
  return logs.value.filter(log => {
    if (log.type === 'tx' && !props.showTx) return false
    return true
  })
})

const addLog = (type: 'rx' | 'tx', data: Uint8Array) => {
  const now = Date.now()

  if (props.isHex) {
    const lastLog = logs.value.length > 0 ? logs.value[logs.value.length - 1] : null
    
    // Check for packet merging: same type, within timeout, and (for RX) logic
    // Usually only merge RX. TX is usually explicit.
    if (type === 'rx' && 
        lastLog && 
        lastLog.type === 'rx' && 
        (now - lastRxTime < PACKET_TIMEOUT)) {
      
      lastLog.data = mergeUint8Arrays(lastLog.data, data)
      // Do not update lastLog.time to keep the timestamp of the first packet
    } else {
      pushLog(type, data)
    }

    if (type === 'rx') {
      lastRxTime = now
    }
    
    if (props.autoScroll) {
        scrollToBottom()
    }
    return
  }

  let offset = 0
  while (offset < data.length) {
    const lastLog = logs.value.length > 0 ? logs.value[logs.value.length - 1] : null
    const canAppend = lastLog && 
                      lastLog.type === type && 
                      lastLog.data.length > 0 && 
                      lastLog.data[lastLog.data.length - 1] !== 0x0A // \n

    let newlineIndex = -1
    for (let i = offset; i < data.length; i++) {
      if (data[i] === 0x0A) {
        newlineIndex = i
        break
      }
    }

    if (newlineIndex !== -1) {
      const chunk = data.slice(offset, newlineIndex + 1)
      if (canAppend && lastLog) {
        lastLog.data = mergeUint8Arrays(lastLog.data, chunk)
      } else {
        pushLog(type, chunk)
      }
      offset = newlineIndex + 1
    } else {
      const chunk = data.slice(offset)
      if (canAppend && lastLog) {
        lastLog.data = mergeUint8Arrays(lastLog.data, chunk)
      } else {
        pushLog(type, chunk)
      }
      offset = data.length
    }
  }

  if (props.autoScroll) {
    scrollToBottom()
  }
}

const pushLog = (type: 'rx' | 'tx', data: Uint8Array) => {
  logs.value.push({
    id: nextId++,
    type,
    data,
    time: Date.now()
  })
  
  if (logs.value.length > MAX_LOGS) {
    logs.value.shift()
  }
}

const mergeUint8Arrays = (a: Uint8Array, b: Uint8Array) => {
  const c = new Uint8Array(a.length + b.length)
  c.set(a)
  c.set(b, a.length)
  return c
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
  box-sizing: border-box; /* Ensure padding doesn't increase height */
  overflow-y: auto;
  background-color: var(--bf-log-bg);
  color: var(--bf-log-text);
  padding: 10px;
  padding-bottom: 20px; /* Add extra space at bottom */
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 14px;
  border-radius: 4px;
  border: 1px solid var(--bf-border-color);
  transition: background-color 0.3s, color 0.3s, border-color 0.3s;
}

.log-item {
  margin-bottom: 2px;
  word-break: break-all;
  white-space: pre-wrap;
  line-height: 1.4;
}

.log-item.tx {
  color: var(--bf-log-tx-color);
}

.log-item.rx {
  color: var(--bf-log-rx-color);
}

.timestamp {
  color: var(--bf-log-time-color);
  margin-right: 8px;
  user-select: none;
}

.direction-icon {
  margin-right: 8px;
  font-weight: bold;
  user-select: none;
}

.log-item.tx .direction-icon {
  color: var(--bf-log-tx-icon);
}

.log-item.rx .direction-icon {
  color: var(--bf-log-rx-icon);
}
</style>
