<template>
  <el-card class="receive-settings" :body-style="{ padding: '10px' }">
    <template #header>
      <div class="card-header">
        <span>接收设置</span>
        <el-icon class="setting-icon"><Setting /></el-icon>
      </div>
    </template>
    <el-form label-width="0" size="small" class="compact-form">
      <el-form-item>
        <el-checkbox v-model="settings.isHex">十六进制显示</el-checkbox>
      </el-form-item>
      <el-form-item>
        <el-checkbox v-model="settings.showTime">显示时间戳</el-checkbox>
      </el-form-item>
       <el-form-item>
        <el-checkbox v-model="settings.autoScroll">自动滚屏</el-checkbox>
      </el-form-item>
      
      <el-form-item style="margin-bottom: 0;">
        <div class="action-buttons">
            <el-button type="primary" @click="$emit('save')" plain size="small" style="flex: 1">保存</el-button>
            <el-button type="warning" @click="$emit('clear')" plain size="small" style="flex: 1">清空</el-button>
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
  font-weight: bold;
  font-size: 14px;
}
.action-buttons {
    display: flex;
    justify-content: space-between;
    width: 100%;
    gap: 5px;
}
.receive-settings :deep(.el-card__header) {
  padding: 8px 10px;
}
.compact-form :deep(.el-form-item) {
    margin-bottom: 8px; /* Checkboxes are compact */
}
</style>
