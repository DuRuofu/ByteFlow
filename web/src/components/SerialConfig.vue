<template>
  <el-card class="serial-config" :body-style="{ padding: '10px' }">
    <template #header>
      <div class="card-header">
        <span>连接设置</span>
        <el-icon class="header-icon"><Connection /></el-icon>
      </div>
    </template>
    <el-form label-width="60px" size="small" class="compact-form">
      <el-form-item label="端口">
         <el-button
           type="default"
           @click="$emit('select-port')"
           :disabled="isConnected"
           style="width: 100%"
           class="port-btn"
           size="small"
         >
           <el-icon v-if="hasPort" class="icon-check"><Check /></el-icon>
           <el-icon v-else class="icon-link"><Link /></el-icon>
           {{ hasPort ? '切换串口' : '选择串口' }}
         </el-button>
      </el-form-item>

      <el-form-item label="波特率">
        <el-select v-model="options.baudRate" :disabled="isConnected" filterable allow-create size="small" class="bf-select">
          <el-option v-for="rate in baudRates" :key="rate" :label="rate" :value="rate" />
        </el-select>
      </el-form-item>

      <el-form-item label="数据位">
        <el-select v-model="options.dataBits" :disabled="isConnected" size="small" class="bf-select">
          <el-option :value="7" label="7" />
          <el-option :value="8" label="8" />
        </el-select>
      </el-form-item>

      <el-form-item label="停止位">
        <el-select v-model="options.stopBits" :disabled="isConnected" size="small" class="bf-select">
          <el-option :value="1" label="1" />
          <el-option :value="2" label="2" />
        </el-select>
      </el-form-item>

      <el-form-item label="校验位">
        <el-select v-model="options.parity" :disabled="isConnected" size="small" class="bf-select">
          <el-option value="none" label="None" />
          <el-option value="even" label="Even" />
          <el-option value="odd" label="Odd" />
        </el-select>
      </el-form-item>

      <el-form-item label-width="0" style="margin-bottom: 0; margin-top: 4px;">
        <el-button
          @click="handleOpen"
          :disabled="isConnected || !hasPort"
          v-if="!isConnected"
          class="btn-connect"
          size="large"
        >
          <el-icon class="btn-icon"><VideoPlay /></el-icon>
          打开串口
        </el-button>
        <el-button
          @click="$emit('close')"
          v-else
          class="btn-disconnect"
          size="large"
        >
          <el-icon class="btn-icon"><SwitchButton /></el-icon>
          关闭串口
        </el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { Connection, Check, Link, VideoPlay, SwitchButton } from '@element-plus/icons-vue'
import type { SerialOptions } from '../composables/useSerial'

interface UIOptions extends SerialOptions {}

const props = defineProps<{
  isConnected: boolean
  hasPort: boolean
}>()

const emit = defineEmits<{
  (e: 'select-port'): void
  (e: 'open', options: SerialOptions): void
  (e: 'close'): void
  (e: 'signals-change', signals: { dataTerminalReady: boolean, requestToSend: boolean }): void
}>()

const options = reactive<UIOptions>({
    baudRate: 115200,
    dataBits: 8,
    stopBits: 1,
    parity: 'none'
})

const baudRates = [9600, 19200, 38400, 57600, 74880, 115200, 230400, 460800, 921600]

const handleOpen = () => {
  emit('open', {
      baudRate: Number(options.baudRate),
      dataBits: options.dataBits,
      stopBits: options.stopBits,
      parity: options.parity
  })
}
</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: var(--bf-font-semibold);
  font-size: var(--bf-font-sm);
  color: var(--bf-text-primary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.header-icon {
  color: var(--bf-accent-cyan);
  font-size: 14px;
}

.serial-config :deep(.el-card__header) {
  padding: var(--bf-space-2) var(--bf-space-3);
  background: var(--bf-bg-tertiary);
  border-bottom: 1px solid var(--bf-border);
}

.compact-form :deep(.el-form-item) {
    margin-bottom: var(--bf-space-2);
}

/* ============================================
   Port Selection Button
   ============================================ */
.port-btn {
  font-family: var(--bf-font-sans);
  transition: all var(--bf-transition-base);
  border-color: var(--bf-border);
  background: var(--bf-bg-tertiary);
  color: var(--bf-text-primary);
}

.port-btn:not(:disabled):hover {
  border-color: var(--bf-accent-cyan);
  color: var(--bf-accent-cyan);
  transform: translateY(-1px);
}

.port-btn .icon-check {
  color: var(--bf-accent-green);
  margin-right: 4px;
}

.port-btn .icon-link {
  margin-right: 4px;
}

/* ============================================
   Connect/Disconnect Button
   ============================================ */
.btn-connect,
.btn-disconnect {
  width: 100%;
  height: 44px;
  font-size: var(--bf-font-base);
  font-weight: var(--bf-font-semibold);
  letter-spacing: 0.5px;
  border: none;
  position: relative;
  overflow: hidden;
  transition: all var(--bf-transition-base);
}

.btn-connect {
  background: linear-gradient(135deg, var(--bf-accent-green), #2EA043);
  color: white;
}

.btn-connect:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(63, 185, 80, 0.35);
}

.btn-connect:active:not(:disabled) {
  transform: translateY(0);
}

.btn-disconnect {
  background: linear-gradient(135deg, var(--bf-accent-red), #B62324);
  color: white;
}

.btn-disconnect:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(248, 81, 73, 0.35);
}

.btn-disconnect:active:not(:disabled) {
  transform: translateY(0);
}

/* Shimmer effect */
.btn-connect::after,
.btn-disconnect::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
  transition: left 0.5s ease;
}

.btn-connect:hover::after,
.btn-disconnect:hover::after {
  left: 100%;
}

.btn-icon {
  margin-right: 6px;
  font-size: 16px;
}

/* ============================================
   Select Styling
   ============================================ */
.bf-select {
  width: 100%;
}

.bf-select :deep(.el-input__wrapper) {
  background: var(--bf-bg-tertiary);
  box-shadow: 0 0 0 1px var(--bf-border) inset;
  transition: all var(--bf-transition-base);
}

.bf-select :deep(.el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px var(--bf-border-active) inset;
}

.bf-select :deep(.el-input.is-focus .el-input__wrapper) {
  box-shadow: 0 0 0 1px var(--bf-accent-cyan) inset, 0 0 0 3px var(--bf-accent-cyan-light) !important;
}

.bf-select :deep(.el-input__inner) {
  color: var(--bf-text-primary);
}
</style>
