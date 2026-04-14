<template>
  <el-card class="receive-settings" :body-style="{ padding: '10px' }">
    <template #header>
      <div class="card-header">
        <span>接收设置</span>
        <el-icon class="header-icon"><Setting /></el-icon>
      </div>
    </template>
    <el-form label-width="0" size="small" class="compact-form">
      <el-form-item>
        <el-checkbox v-model="settings.isHex" class="bf-checkbox">十六进制显示</el-checkbox>
      </el-form-item>
      <el-form-item>
        <el-checkbox v-model="settings.showTime" class="bf-checkbox">显示时间戳</el-checkbox>
      </el-form-item>
      <el-form-item>
        <el-checkbox v-model="settings.autoScroll" class="bf-checkbox">自动滚屏</el-checkbox>
      </el-form-item>

      <el-form-item style="margin-bottom: 0; margin-top: var(--bf-space-2);">
        <div class="action-buttons">
            <el-button type="default" @click="$emit('save')" size="small" class="action-btn">
              <el-icon class="btn-icon"><Download /></el-icon>
              保存
            </el-button>
            <el-button type="default" @click="$emit('clear')" size="small" class="action-btn">
              <el-icon class="btn-icon"><Delete /></el-icon>
              清空
            </el-button>
        </div>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'
import { Setting, Download, Delete } from '@element-plus/icons-vue'

const props = defineProps<{
    modelValue: {
        isHex: boolean
        showTime: boolean
        autoScroll: boolean
    }
}>()

const emit = defineEmits<{
    (e: 'update:modelValue', value: any): void
    (e: 'clear'): void
    (e: 'save'): void
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

.receive-settings :deep(.el-card__header) {
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
.bf-checkbox {
    transition: color var(--bf-transition-fast);
}

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
   Action Buttons
   ============================================ */
.action-buttons {
    display: flex;
    justify-content: space-between;
    width: 100%;
    gap: var(--bf-space-2);
}

.action-btn {
    flex: 1;
    font-size: var(--bf-font-sm);
    background: var(--bf-bg-tertiary);
    border-color: var(--bf-border);
    color: var(--bf-text-secondary);
    transition: all var(--bf-transition-base);
}

.action-btn:hover {
    border-color: var(--bf-border-active);
    color: var(--bf-accent-cyan);
    background: var(--bf-accent-cyan-light);
}

.btn-icon {
    margin-right: 4px;
    font-size: 12px;
}
</style>
