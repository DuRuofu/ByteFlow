<template>
  <el-card class="serial-config" :body-style="{ padding: '10px' }">
    <template #header>
      <div class="card-header">
        <span>连接设置</span>
      </div>
    </template>
    <el-form label-width="60px" size="small" class="compact-form">
      <el-form-item label="端口">
         <el-button 
           type="primary" 
           @click="$emit('select-port')" 
           :disabled="isConnected" 
           style="width: 100%"
           :icon="hasPort ? 'Check' : 'Link'"
           size="small"
         >
           {{ hasPort ? '切换串口' : '选择串口' }}
         </el-button>
      </el-form-item>
      
      <el-form-item label="波特率">
        <el-select v-model="options.baudRate" :disabled="isConnected" filterable allow-create size="small">
          <el-option v-for="rate in baudRates" :key="rate" :label="rate" :value="rate" />
        </el-select>
      </el-form-item>
      
      <el-form-item label="数据位">
        <el-select v-model="options.dataBits" :disabled="isConnected" size="small">
          <el-option :value="7" label="7" />
          <el-option :value="8" label="8" />
        </el-select>
      </el-form-item>

      <el-form-item label="停止位">
        <el-select v-model="options.stopBits" :disabled="isConnected" size="small">
          <el-option :value="1" label="1" />
          <el-option :value="2" label="2" />
        </el-select>
      </el-form-item>

      <el-form-item label="校验位">
        <el-select v-model="options.parity" :disabled="isConnected" size="small">
          <el-option value="none" label="None" />
          <el-option value="even" label="Even" />
          <el-option value="odd" label="Odd" />
        </el-select>
      </el-form-item>
      
      <el-form-item label-width="0" style="margin-bottom: 0;">
        <el-button 
          type="success" 
          @click="handleOpen" 
          :disabled="isConnected || !hasPort" 
          v-if="!isConnected"
          style="width: 100%; height: 40px; font-size: 16px;"
          icon="VideoPlay"
        >
          打开串口
        </el-button>
        <el-button 
          type="danger" 
          @click="$emit('close')" 
          v-else
          style="width: 100%; height: 40px; font-size: 16px;"
          icon="SwitchButton"
        >
          关闭串口
        </el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'
import type { SerialOptions } from '../composables/useSerial'

// Extended options for UI
interface UIOptions extends SerialOptions {
    // DTR/RTS removed from UI but might be needed for internal logic if we kept them
    // But user asked to remove them from UI
}

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

// Removed updateSignals as UI controls are gone
</script>

<style scoped>
.card-header {
  font-weight: bold;
  font-size: 14px;
}
.serial-config :deep(.el-card__header) {
  padding: 8px 10px;
}
.compact-form :deep(.el-form-item) {
    margin-bottom: 12px;
}
</style>
