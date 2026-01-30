<template>
  <el-card class="serial-config">
    <template #header>
      <div class="card-header">
        <span>连接设置</span>
      </div>
    </template>
    <el-form label-width="70px" size="small">
      <el-form-item label="端口">
         <el-button 
           type="primary" 
           @click="$emit('select-port')" 
           :disabled="isConnected" 
           style="width: 100%"
           :icon="hasPort ? 'Check' : 'Link'"
         >
           {{ hasPort ? '切换串口' : '选择串口' }}
         </el-button>
      </el-form-item>
      
      <el-form-item label="波特率">
        <el-select v-model="options.baudRate" :disabled="isConnected" filterable allow-create>
          <el-option v-for="rate in baudRates" :key="rate" :label="rate" :value="rate" />
        </el-select>
      </el-form-item>
      
      <el-form-item label="数据位">
        <el-select v-model="options.dataBits" :disabled="isConnected">
          <el-option :value="7" label="7" />
          <el-option :value="8" label="8" />
        </el-select>
      </el-form-item>

      <el-form-item label="停止位">
        <el-select v-model="options.stopBits" :disabled="isConnected">
          <el-option :value="1" label="1" />
          <el-option :value="2" label="2" />
        </el-select>
      </el-form-item>

      <el-form-item label="校验位">
        <el-select v-model="options.parity" :disabled="isConnected">
          <el-option value="none" label="None" />
          <el-option value="even" label="Even" />
          <el-option value="odd" label="Odd" />
        </el-select>
      </el-form-item>
      
      <el-form-item label="控制">
          <el-checkbox v-model="options.dtr" @change="updateSignals" :disabled="!isConnected">DTR</el-checkbox>
          <el-checkbox v-model="options.rts" @change="updateSignals" :disabled="!isConnected">RTS</el-checkbox>
      </el-form-item>

      <el-form-item label="操作">
        <el-button 
          type="success" 
          @click="handleOpen" 
          :disabled="isConnected || !hasPort" 
          v-if="!isConnected"
          style="width: 100%"
          icon="VideoPlay"
        >
          打开串口
        </el-button>
        <el-button 
          type="danger" 
          @click="$emit('close')" 
          v-else
          style="width: 100%"
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
    dtr: boolean
    rts: boolean
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
    parity: 'none',
    dtr: false,
    rts: false
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

const updateSignals = () => {
    emit('signals-change', {
        dataTerminalReady: options.dtr,
        requestToSend: options.rts
    })
}
</script>

<style scoped>
.card-header {
  font-weight: bold;
}
</style>
