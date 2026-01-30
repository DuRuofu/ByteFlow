<template>
  <el-card class="send-settings" :body-style="{ padding: '10px' }">
    <template #header>
      <div class="card-header">
        <span>发送设置</span>
        <el-icon class="setting-icon"><Setting /></el-icon>
      </div>
    </template>
    <el-form label-width="0" size="small" class="compact-form">
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
      
      <el-form-item style="margin-bottom: 0;">
         <div class="flex-row">
            <el-checkbox v-model="settings.useTimer">定时</el-checkbox>
            <el-input 
                v-model="settings.timerInterval" 
                type="number"
                style="width: 100%" 
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
  font-size: 14px;
}
.flex-row {
    display: flex;
    align-items: center;
    gap: 5px;
}
.unit {
    font-size: 12px;
    color: var(--bf-text-secondary);
    white-space: nowrap;
}
.send-settings :deep(.el-card__header) {
  padding: 8px 10px;
}
.compact-form :deep(.el-form-item) {
    margin-bottom: 8px; /* Slightly more space for inputs */
}
.send-settings :deep(.el-input__inner) {
    -moz-appearance: textfield;
}
.send-settings :deep(.el-input__inner)::-webkit-outer-spin-button,
.send-settings :deep(.el-input__inner)::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}
</style>
