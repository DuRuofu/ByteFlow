<template>
  <el-card class="send-settings" :body-style="{ padding: '10px' }">
    <template #header>
      <div class="card-header">
        <span>发送设置</span>
        <el-icon class="header-icon"><Setting /></el-icon>
      </div>
    </template>
    <el-form label-width="0" size="small" class="compact-form">
      <el-form-item>
        <el-checkbox v-model="settings.isHex" class="bf-checkbox">十六进制发送</el-checkbox>
      </el-form-item>
      <el-form-item>
        <el-checkbox v-model="settings.showTx" class="bf-checkbox">显示发送字符串</el-checkbox>
      </el-form-item>

      <el-form-item>
        <el-select v-model="settings.lineEnding" style="width: 100%" size="small" placeholder="行尾" class="bf-select">
           <el-option label="无行尾" value="" />
           <el-option label="LF (\n)" value="\n" />
           <el-option label="CRLF (\r\n)" value="\r\n" />
        </el-select>
      </el-form-item>

      <el-form-item style="margin-bottom: 0;">
         <div class="timer-row">
            <el-checkbox v-model="settings.useTimer" class="bf-checkbox">定时</el-checkbox>
            <el-input
                v-model="settings.timerInterval"
                type="number"
                class="timer-input"
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

.send-settings :deep(.el-card__header) {
  padding: var(--bf-space-2) var(--bf-space-3);
  background: var(--bf-bg-tertiary);
  border-bottom: 1px solid var(--bf-border);
}

.compact-form :deep(.el-form-item) {
    margin-bottom: var(--bf-space-1);
}

/* ============================================
   Checkbox Styling
   ============================================ */
.bf-checkbox :deep(.el-checkbox__label) {
    font-size: var(--bf-font-sm);
    color: var(--bf-text-secondary);
}

.bf-checkbox:hover :deep(.el-checkbox__label) {
    color: var(--bf-text-primary);
}

.bf-checkbox :deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
    background: var(--bf-accent-cyan);
    border-color: var(--bf-accent-cyan);
}

.bf-checkbox :deep(.el-checkbox__input.is-checked + .el-checkbox__label) {
    color: var(--bf-text-primary);
}

/* ============================================
   Timer Row
   ============================================ */
.timer-row {
    display: flex;
    align-items: center;
    gap: var(--bf-space-2);
    width: 100%;
}

.timer-input {
    width: 80px !important;
    flex-shrink: 0;
}

.timer-input :deep(.el-input__wrapper) {
    background: var(--bf-bg-tertiary);
    box-shadow: 0 0 0 1px var(--bf-border) inset;
}

.timer-input :deep(.el-input__inner) {
    -moz-appearance: textfield;
    font-family: var(--bf-font-mono);
}

.timer-input :deep(.el-input__inner)::-webkit-outer-spin-button,
.timer-input :deep(.el-input__inner)::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

.timer-input :deep(.el-input__wrapper:hover) {
    box-shadow: 0 0 0 1px var(--bf-border-active) inset;
}

.timer-input :deep(.el-input.is-disabled .el-input__wrapper) {
    background: var(--bf-bg-secondary);
}

.unit {
    font-size: var(--bf-font-xs);
    color: var(--bf-text-tertiary);
    white-space: nowrap;
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
}

.bf-select :deep(.el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px var(--bf-border-active) inset;
}

.bf-select :deep(.el-input.is-focus .el-input__wrapper) {
  box-shadow: 0 0 0 1px var(--bf-accent-cyan) inset, 0 0 0 2px var(--bf-accent-cyan-light) !important;
}

.bf-select :deep(.el-input__inner) {
  color: var(--bf-text-primary);
  font-size: var(--bf-font-sm);
}
</style>
