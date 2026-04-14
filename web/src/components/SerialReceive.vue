<template>
  <div class="terminal-container">
    <!-- Terminal Header -->
    <div class="terminal-header">
      <div class="terminal-dots">
        <span class="terminal-dot red"></span>
        <span class="terminal-dot yellow"></span>
        <span class="terminal-dot green"></span>
      </div>
      <span class="terminal-title">Serial Monitor</span>
      <div class="terminal-actions">
        <slot name="actions"></slot>
      </div>
    </div>

    <!-- Terminal Body -->
    <div class="terminal-body" ref="containerRef">
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

      <!-- Empty state -->
      <div v-if="displayLogs.length === 0" class="empty-state">
        <span class="empty-icon">▸</span>
        <span class="empty-text">等待数据...</span>
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
const PACKET_TIMEOUT = 50
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

    if (type === 'rx' &&
        lastLog &&
        lastLog.type === 'rx' &&
        (now - lastRxTime < PACKET_TIMEOUT)) {

      lastLog.data = mergeUint8Arrays(lastLog.data, data)
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
                      lastLog.data[lastLog.data.length - 1] !== 0x0A

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
/* ============================================
   Terminal Container
   ============================================ */
.terminal-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--bf-log-bg);
  transition: background-color var(--bf-transition-slow);
}

/* ============================================
   Terminal Header
   ============================================ */
.terminal-header {
  display: flex;
  align-items: center;
  gap: var(--bf-space-3);
  padding: var(--bf-space-2) var(--bf-space-3);
  background: var(--bf-log-header-bg);
  border-bottom: 1px solid var(--bf-border);
  flex-shrink: 0;
}

.terminal-dots {
  display: flex;
  gap: 6px;
}

.terminal-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  flex-shrink: 0;
}

.terminal-dot.red {
  background: #FF5F56;
}

.terminal-dot.yellow {
  background: #FFBD2E;
}

.terminal-dot.green {
  background: #27CA40;
}

.terminal-title {
  font-family: var(--bf-font-mono);
  font-size: var(--bf-font-xs);
  color: var(--bf-text-tertiary);
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: var(--bf-font-medium);
}

.terminal-actions {
  margin-left: auto;
}

/* ============================================
   Terminal Body
   ============================================ */
.terminal-body {
  flex: 1;
  overflow-y: auto;
  padding: var(--bf-space-3);
  font-family: var(--bf-font-mono);
  font-size: var(--bf-font-base);
  line-height: 1.6;
}

/* ============================================
   Log Items
   ============================================ */
.log-list {
  display: flex;
  flex-direction: column;
}

.log-item {
  display: flex;
  gap: var(--bf-space-2);
  padding: 2px 0;
  word-break: break-all;
  white-space: pre-wrap;
  transition: background-color var(--bf-transition-fast);
  border-radius: var(--bf-radius-sm);
  margin: 0 -4px;
  padding: 2px 4px;
}

.log-item:hover {
  background: rgba(255, 255, 255, 0.03);
}

html:not(.dark) .log-item:hover {
  background: rgba(0, 0, 0, 0.03);
}

.log-item.tx {
  color: var(--bf-log-tx);
}

.log-item.rx {
  color: var(--bf-log-rx);
}

.timestamp {
  color: var(--bf-log-timestamp);
  flex-shrink: 0;
  user-select: none;
  font-size: var(--bf-font-xs);
}

.direction-icon {
  flex-shrink: 0;
  width: 14px;
  text-align: center;
  font-weight: bold;
  user-select: none;
}

html.dark .log-item.tx .direction-icon {
  color: var(--bf-accent-cyan);
}

html.dark .log-item.rx .direction-icon {
  color: var(--bf-accent-green);
}

html:not(.dark) .log-item.tx .direction-icon {
  color: var(--bf-log-tx);
}

html:not(.dark) .log-item.rx .direction-icon {
  color: var(--bf-log-rx);
}

.content {
  flex: 1;
}

/* HEX mode spacing */
.log-item .content.hex {
  letter-spacing: 1px;
}

/* ============================================
   Empty State
   ============================================ */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  min-height: 120px;
  color: var(--bf-text-tertiary);
  gap: var(--bf-space-2);
}

.empty-icon {
  font-size: 24px;
  opacity: 0.5;
  animation: pulse 2s ease-in-out infinite;
}

.empty-text {
  font-size: var(--bf-font-sm);
  font-family: var(--bf-font-mono);
}
</style>
