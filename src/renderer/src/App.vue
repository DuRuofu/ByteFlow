<template>
  <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
    <el-tab-pane label="串口" name="first">
      <template #label>
        <span class="custom-tabs-label">
          <el-icon>
            <calendar />
          </el-icon>
          <span>串口</span>
        </span>
      </template>
      <div class="common-layout">
        <el-container>
          <el-aside class="Aside">
            <el-form :model="form" label-width="auto" style="max-width: 600px">
              <el-form-item label="串口名:" label-position="left">
                <el-select v-model="form.SerialPort" placeholder="">
                  <el-option label="Zone one" value="shanghai" />
                  <el-option label="Zone two" value="beijing" />
                </el-select>
              </el-form-item>
              <el-form-item label="波特率:" label-position="left">
                <el-select v-model="form.SerialPort" placeholder="">
                  <el-option label="Zone one" value="shanghai" />
                  <el-option label="Zone two" value="beijing" />
                </el-select>
              </el-form-item>
              <el-form-item label="数据位:" label-position="left">
                <el-select v-model="form.SerialPort" placeholder="">
                  <el-option label="Zone one" value="shanghai" />
                  <el-option label="Zone two" value="beijing" />
                </el-select>
              </el-form-item>
              <el-form-item label="校验位:" label-position="left">
                <el-select v-model="form.SerialPort" placeholder="">
                  <el-option label="Zone one" value="shanghai" />
                  <el-option label="Zone two" value="beijing" />
                </el-select>
              </el-form-item>
              <el-form-item label="停止位:" label-position="left">
                <el-select v-model="form.SerialPort" placeholder="">
                  <el-option label="Zone one" value="shanghai" />
                  <el-option label="Zone two" value="beijing" />
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" style="width: 90%" @click="onSubmit">连接</el-button>
              </el-form-item>
              <el-form-item label="接收设置" label-position="left">
                <el-checkbox-group v-model="form.type">
                  <el-checkbox value="Online activities" name="type">
                    Online activities
                  </el-checkbox>
                  <el-checkbox value="Promotion activities" name="type">
                    Promotion activities
                  </el-checkbox>
                  <el-checkbox value="Offline activities" name="type">
                    Offline activities
                  </el-checkbox>
                  <el-checkbox value="Simple brand exposure" name="type">
                    Simple brand exposure
                  </el-checkbox>
                </el-checkbox-group>
              </el-form-item>
              <el-form-item label="发送设置" label-position="left">
                <el-checkbox-group v-model="form.type">
                  <el-checkbox value="Online activities" name="type">
                    Online activities
                  </el-checkbox>
                  <el-checkbox value="Promotion activities" name="type">
                    Promotion activities
                  </el-checkbox>
                </el-checkbox-group>
              </el-form-item>
              <el-form-item label="其他" label-position="left">
                <el-radio-group v-model="form.resource">
                  <el-radio value="Sponsor">Sponsor</el-radio>
                  <el-radio value="Venue">Venue</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="onSubmit">Create</el-button>
                <el-button>Cancel</el-button>
              </el-form-item>
            </el-form>
          </el-aside>
          <el-main class="Main">
            <div class="ReceiveBuffer">
              <el-input v-model="textarea" type="textarea" placeholder="" resize="none" />
            </div>

            <div class="SendBuffer">

              <el-input v-model="textarea" type="textarea" placeholder="" resize="none" />
              <el-button>发送</el-button>
            </div>
            <div class="ReceiveBufferInfo">
              <div>接收数据：xx字节</div>
              <div>发送数据：xx字节</div>
              <div>重新计数</div>
            </div>
          </el-main>
        </el-container>
      </div>
    </el-tab-pane>
    <el-tab-pane label="示波器" name="second">Config</el-tab-pane>
    <el-tab-pane label="数据引擎" name="third">Role</el-tab-pane>
    <el-tab-pane label="设置" name="fourth">Task</el-tab-pane>
    <el-tab-pane label="关于" name="fifth">Task</el-tab-pane>
  </el-tabs>
</template>
<script lang="ts" setup>
import { ref, reactive } from 'vue'
import type { TabsPaneContext } from 'element-plus'
import { Calendar } from '@element-plus/icons-vue'

const activeName = ref('first')

// do not use same name with ref
const form = reactive({
  // 串口号
  SerialPort: '',
  // 波特率
  BaudRate: 9600,
  delivery: false,
  type: [],
  resource: '',
  desc: '',
})
const textarea = ref('')
const onSubmit = () => {
  console.log('submit!')
}

const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event)
}
</script>

<style scoped lang="scss">
.demo-tabs .el-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}

.common-layout {
  height: calc(100vh - 70px);
  /* 减去页头的高度 */
  width: 100%;

  .Aside {
    height: calc(100vh - 70px);
    /* 高度继承父元素 */
    //width: 30%;
    // 最大宽度
    max-width: 260px;
    min-width: 260px;
    margin-right: 10px;
  }

  .Main {
    height: calc(100vh - 70px);
    /* 高度继承父元素 */
    //width: 70%;
    padding: 0;
    margin: 0;

    display: flex;
    flex-direction: column;
    /* 子元素纵向排列 */
    overflow: hidden;

    .ReceiveBuffer {
      height: 87%;
      width: 100%;
      background-color: #631b1b;

      .el-input,
      .el-textarea {
        height: 100%;
        /* 高度填满 */
        width: 100%;
        /* 宽度填满 */
      }
    }

    .SendBuffer {
      display: flex;
      /* 启用 Flexbox 布局 */
      align-items: center;
      /* 垂直方向居中 */
      height: 10%;
      width: 100%;
      background-color: #491c1c;
      margin-top: 10px;

      .el-input {
        flex: 3;
        /* 占 80% 的宽度 */
        margin-right: 10px;
        /* 与按钮之间的间距 */
      }

      .el-input,
      .el-textarea {
        height: 100%;
        /* 高度填满 */
        width: 100%;
        /* 宽度填满 */
      }

      .el-button {
        flex: 1;
        /* 占 20% 的宽度 */
        height: 100%;
        white-space: nowrap;
        /* 防止文字超出换行 */
      }
    }

    .ReceiveBufferInfo {
      display: flex;
      /* 启用 Flexbox 布局 */
      justify-content: space-between;
      /* 子元素水平分布：左、中、右 */
      align-items: center;
      /* 子元素垂直方向居中 */
      height: 3%;
      /* 根据需要设置高度 */
      padding: 0 10px;
      margin-top: 3px;

      div {
        flex: 1;
        /* 子元素均分宽度 */
        text-align: center;
        /* 保证中间的文字居中 */
      }

      div:first-child {
        text-align: left;
        /* 左对齐 */
      }

      div:last-child {
        text-align: right;
        /* 右对齐 */
      }
    }

    :deep(.el-textarea__inner) {
      height: 100%;
      /* 深度样式处理 */
    }
  }
}
</style>
