<template>
  <div style="position: relative">
    <el-tabs v-model="activeName" class="tabs" @tab-click="handleClick">
      <el-tab-pane label="串口" name="first">
        <template #label>
          <span class="tabs-label">
            <el-icon>
              <calendar />
            </el-icon>
            <span>串口</span>
          </span>
        </template>
        <serial />
      </el-tab-pane>
      <el-tab-pane label="示波器" name="second">
        <template #label>
          <span class="tabs-label">
            <el-icon><DataLine /></el-icon>
            <span>示波器</span>
          </span>
        </template>
        <oscilloscope />
      </el-tab-pane>
      <el-tab-pane label="数据引擎" name="third">
        <template #label>
          <span class="tabs-label">
            <el-icon><Cpu /></el-icon>
            <span>数据引擎</span>
          </span>
        </template></el-tab-pane
      >
      <el-tab-pane label="关于" name="fifth">
        <template #label>
          <span class="tabs-label">
            <el-icon><Link /></el-icon>
            <span>关于</span>
          </span>
        </template>
        <about />
      </el-tab-pane>
    </el-tabs>
    <el-button class="button-seting" :icon="Setting" />
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import type { TabsPaneContext } from 'element-plus'
import { Calendar, Setting, DataLine, Cpu, Link } from '@element-plus/icons-vue'

// 引入串口组件
import serial from './views/serial/serial.vue'
import oscilloscope from './views/oscilloscope/oscilloscope.vue'
import about from './views/about/about.vue'

const activeName = ref('first')

const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event)
}
</script>

<style scoped lang="scss">
.tabs .el-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}

.tabs {
  user-select: none;
}

.tabs .tabs-label .el-icon {
  vertical-align: middle;
}

.tabs .tabs-label span {
  vertical-align: middle;
  margin-left: 4px;
}

.button-seting {
  position: absolute;
  right: 10px;
  top: 5px;
  // 去除边框
  border: none;
}
</style>
