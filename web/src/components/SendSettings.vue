<template>
  <el-card class="send-settings">
    <template #header>
      <div class="card-header">
        <span>发送设置</span>
        <el-icon class="setting-icon"><Setting /></el-icon>
      </div>
    </template>
    <el-form label-width="0" size="small">
      <!-- <el-form-item>
         <el-checkbox v-model="settings.sendFile" disabled>发送文件</el-checkbox>
      </el-form-item> -->
      <el-form-item>
        <el-checkbox v-model="settings.isHex">十六进制发送</el-checkbox>
      </el-form-item>
      <el-form-item>
        <el-checkbox v-model="settings.showTx">显示发送字符串</el-checkbox>
      </el-form-item>

      <el-form-item>
          <el-select v-model="settings.lineEnding" style="width: 100%" size="small" placeholder="行尾">
             <el-option label="无行尾" value="" />
             <el-option label="LF (\n)" value="\n" />
             <el-option label="CRLF (\r\n)" value="\r\n" />
          </el-select>
      </el-form-item>
      
      <el-form-item>
         <div class="flex-row">
            <el-checkbox v-model="settings.useTimer">定时发送</el-checkbox>
            <el-input-number 
                v-model="settings.timerInterval" 
                :min="10" 
                :max="60000" 
                controls-position="right" 
                style="width: 80px" 
                size="small" 
                :disabled="!settings.useTimer"
            />
            <span class="unit">ms</span>
         </div>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'

const props = defineProps<{
    modelValue: {
        isHex: boolean
        showTx: boolean
        useTimer: boolean
        timerInterval: number
        lineEnding: string
    }
}>()

const emit = defineEmits<{
    (e: 'update:modelValue', value: any): void
}>()

const settings = reactive({ ...props.modelValue })

watch(settings, (newVal) => {
    emit('update:modelValue', newVal)
})
</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: bold;
}
.flex-row {
    display: flex;
    align-items: center;
    gap: 5px;
}
.unit {
    font-size: 12px;
    color: var(--bf-text-secondary);
}
</style>
