<template>
  <div class="layout-serial">
    <el-container>
      <el-aside class="serial-aside">
        <el-form :model="form" label-width="auto" style="max-width: 600px">
          <el-form-item label="串口名:" label-position="left">
            <el-select v-model="form.base.serialPort" placeholder="">
              <el-option label="Zone one" value="shanghai" />
              <el-option label="Zone two" value="beijing" />
            </el-select>
          </el-form-item>
          <el-form-item label="波特率:" label-position="left">
            <el-select v-model="form.base.baudRate" placeholder="">
              <el-option label="1200" value="1200" />
              <el-option label="2400" value="2400" />
              <el-option label="4800" value="4800" />
              <el-option label="9600" value="9600" />
              <el-option label="14400" value="14400" />
              <el-option label="19200" value="19200" />
              <el-option label="38400" value="38400" />
              <el-option label="57600" value="57600" />
              <el-option label="115200" value="115200" />
            </el-select>
          </el-form-item>
          <el-form-item label="数据位:" label-position="left">
            <el-select v-model="form.base.dataBits" placeholder="">
              <el-option label="5" value="5" />
              <el-option label="6" value="6" />
              <el-option label="7" value="7" />
              <el-option label="8" value="8" />
            </el-select>
          </el-form-item>
          <el-form-item label="校验位:" label-position="left">
            <el-select v-model="form.base.parity" placeholder="">
              <el-option label="none" value="none" />
              <el-option label="even" value="even" />
              <el-option label="odd" value="odd" />
            </el-select>
          </el-form-item>
          <el-form-item label="停止位:" label-position="left">
            <el-select v-model="form.base.stopBits" placeholder="">
              <el-option label="1" value="1" />
              <el-option label="1.5" value="1.5" />
              <el-option label="2" value="2" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button
              :style="{
                width: '100%',
                backgroundColor: serialConnected ? '#23c456' : '',
                color: 'white',
                borderColor: serialConnected ? '#23c456' : ''
              }"
              @click="serialOnOff"
            >
              {{ serialConnected ? '关闭串口' : '打开串口' }}
            </el-button>
          </el-form-item>
          <el-form-item label="接收设置:" label-position="left">
            <el-checkbox-group v-model="form.receive">
              <el-checkbox label="saveToFile" name="receive">保存到文件</el-checkbox>
              <el-checkbox label="showInHex" name="receive">以16进制显示</el-checkbox>
              <el-checkbox label="addTimestamp" name="receive">添加时间戳</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item>
            <el-button style="width: 47%" @click="saveData">保存数据</el-button>
            <el-button style="width: 47%" @click="clearData">清空数据</el-button>
          </el-form-item>
          <el-form-item label="发送设置:" label-position="left">
            <el-checkbox-group v-model="form.send">
              <el-checkbox value="hexSend" name="type"> 十六进制发送 </el-checkbox>
              <el-checkbox value="regularlySend" name="type"> 定时发送 </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="其他:" label-position="left">
            <el-radio-group v-model="form.resource">
              <el-radio value="Sponsor">显示发送字符串</el-radio>
              <el-radio value="Venue">其他</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </el-aside>
      <el-main class="serial-main">
        <div class="serial-receive-text-box">
          <el-input v-model="receiveBuffer" type="textarea" placeholder="" resize="none" />
        </div>

        <div class="serial-send-text-box">
          <el-input v-model="sendBuffer" type="textarea" placeholder="" resize="none" />
          <el-button @click="sendData">发送</el-button>
        </div>
        <div class="serial-receive-info-box">
          <div>接收数据:{{ receiveBufferSize }}字节</div>
          <div>发送数据:{{ sendBufferSize }}字节</div>
          <div>重新计数</div>
        </div>
      </el-main>
    </el-container>
  </div>
</template>
<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'

const form = reactive({
  base: {
    // 串口号
    serialPort: '',
    // 波特率
    baudRate: 9600,
    // 数据位
    dataBits: 8,
    // 校验位
    parity: 'none',
    // 停止位
    stopBits: 1
  },
  // 接收设置
  receive: [],
  // 发送设置
  send: [],
  // 其他
  resource: ''
})

// 接收缓冲区
const receiveBuffer = ref('')
// 发送缓冲区
const sendBuffer = ref('')
// 接收缓冲区
const receiveBufferSize = ref(0)
// 发送缓冲区
const sendBufferSize = ref(0)

// 连接标识
const serialConnected = ref(false)
const serialOnOff = () => {
  console.log('serialOnOff!')
  serialConnected.value = !serialConnected.value
}

// 保存数据
const saveData = () => {
  console.log('saveData!')
}

// 清空数据
const clearData = () => {
  console.log('clearData!')
}

// 发送数据
const sendData = () => {
  console.log('sendData!')
}
// 初始化数据
const initData = () => {}

// 组件挂载完毕
onMounted(() => {
  initData() // 获取表格数据
})
</script>
<style scoped lang="scss">
.layout-serial {
  height: calc(100vh - 73px);
  /* 减去页头的高度 */
  width: 100%;

  .serial-aside {
    height: calc(100vh - 73px);
    /* 高度继承父元素 */
    //width: 30%;
    // 最大宽度
    max-width: 260px;
    min-width: 260px;
    margin-right: 10px;

    .el-form-item {
      margin-bottom: 5px;
    }
  }

  .serial-main {
    height: calc(100vh - 73px);
    /* 高度继承父元素 */
    //width: 70%;
    padding: 0;
    margin: 0;

    display: flex;
    flex-direction: column;
    /* 子元素纵向排列 */
    overflow: hidden;

    .serial-receive-text-box {
      height: 87%;
      width: 100%;

      .el-input,
      .el-textarea {
        height: 100%;
        /* 高度填满 */
        width: 100%;
        /* 宽度填满 */
      }
    }

    .serial-send-text-box {
      display: flex;
      /* 启用 Flexbox 布局 */
      align-items: center;
      /* 垂直方向居中 */
      height: 10%;
      width: 100%;
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

    .serial-receive-info-box {
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

      // 字体
      font-size: 16px;
      color: #c5c8cb;
    }

    :deep(.el-textarea__inner) {
      height: 100%;
      /* 深度样式处理 */
    }
  }
}
</style>
