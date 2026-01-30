<template>
  <el-card class="receive-settings">
    <template #header>
      <div class="card-header">
        <span>接收设置</span>
        <el-icon class="setting-icon"><Setting /></el-icon>
      </div>
    </template>
    <el-form label-width="0" size="small">
      <!-- <el-form-item>
        <el-checkbox v-model="settings.saveToFile" disabled>将接收保存到文件</el-checkbox>
      </el-form-item> -->
      <el-form-item>
        <el-checkbox v-model="settings.isHex">十六进制显示</el-checkbox>
      </el-form-item>
      <el-form-item>
        <el-checkbox v-model="settings.showTime">显示时间戳</el-checkbox>
      </el-form-item>
       <el-form-item>
        <el-checkbox v-model="settings.autoScroll">自动滚屏</el-checkbox>
      </el-form-item>
      <!-- <el-form-item>
        <div class="flex-row">
            <el-checkbox v-model="settings.autoBreak">自动断帧</el-checkbox>
            <el-input-number v-model="settings.breakTime" :min="1" :max="5000" controls-position="right" style="width: 80px" size="small" />
            <span class="unit">ms</span>
        </div>
      </el-form-item> -->
      
      <el-form-item>
        <div class="action-buttons">
            <el-button type="primary" @click="$emit('save')" plain size="small">保存数据</el-button>
            <el-button type="warning" @click="$emit('clear')" plain size="small">清空数据</el-button>
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
}
.action-buttons {
    display: flex;
    justify-content: space-between;
    width: 100%;
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
