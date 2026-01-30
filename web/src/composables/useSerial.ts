import { ref } from 'vue'
import { ElMessage } from 'element-plus'

export interface SerialOptions {
  baudRate: number
  dataBits: 7 | 8
  stopBits: 1 | 2
  parity: 'none' | 'even' | 'odd'
}

export function useSerial() {
  const port = ref<SerialPort | null>(null)
  const isConnected = ref(false)
  const isReading = ref(false)
  const rxCount = ref(0)
  const txCount = ref(0)
  
  let reader: ReadableStreamDefaultReader<Uint8Array> | undefined
  let writer: WritableStreamDefaultWriter<Uint8Array> | undefined

  const onDataCallbacks: ((data: Uint8Array) => void)[] = []
  
  const onData = (callback: (data: Uint8Array) => void) => {
    onDataCallbacks.push(callback)
  }

  const resetCounts = () => {
      rxCount.value = 0
      txCount.value = 0
  }

  const requestPort = async () => {
    if (!navigator.serial) {
      ElMessage.error('Web Serial API 不支持此浏览器')
      return null
    }
    try {
      const selectedPort = await navigator.serial.requestPort()
      port.value = selectedPort
      return selectedPort
    } catch (error: any) {
      console.error('Error requesting port:', error)
      if (error.name !== 'NotFoundError') {
         ElMessage.error(`选择串口失败: ${error.message}`)
      }
      return null
    }
  }

  const readLoop = async () => {
    if (!port.value || !port.value.readable) return
    
    isReading.value = true
    
    try {
      reader = port.value.readable.getReader()
      while (true) {
        const { value, done } = await reader!.read()
        if (done) {
          // Reader has been canceled
          break
        }
        if (value) {
            rxCount.value += value.byteLength
            onDataCallbacks.forEach(cb => cb(value))
        }
      }
    } catch (error: any) {
      console.error('Read error:', error)
    } finally {
      if (reader) {
        reader.releaseLock()
        reader = undefined
      }
      isReading.value = false
    }
  }

  const openPort = async (options: SerialOptions) => {
    if (!port.value) return

    try {
      await port.value.open({ 
        baudRate: options.baudRate,
        dataBits: options.dataBits,
        stopBits: options.stopBits,
        parity: options.parity
      })
      isConnected.value = true
      ElMessage.success('串口已打开')
      // Start reading
      readLoop()
    } catch (error: any) {
      console.error('Error opening port:', error)
      ElMessage.error(`打开串口失败: ${error.message}`)
      isConnected.value = false
    }
  }

  const closePort = async () => {
    if (!port.value || !isConnected.value) return

    try {
      // Cancel the reader to exit the read loop
      if (reader) {
        await reader.cancel()
        // Wait for the read loop to finish its finally block
        // In a real app we might want to wait for a promise here, 
        // but JS is single threaded so if we await cancel, the loop should progress to done.
      }
      
      if (writer) {
        await writer.close()
        writer = undefined
      }

      await port.value.close()
      isConnected.value = false
      port.value = null // Optionally clear the port
      ElMessage.success('串口已关闭')
    } catch (error: any) {
      console.error('Error closing port:', error)
      ElMessage.error(`关闭串口失败: ${error.message}`)
    }
  }

  const send = async (data: Uint8Array | string) => {
    if (!port.value || !port.value.writable) {
        ElMessage.warning('串口未打开或不可写')
        return
    }

    try {
        writer = port.value.writable.getWriter()
        const dataToSend = typeof data === 'string' ? new TextEncoder().encode(data) : data
        await writer!.write(dataToSend)
        txCount.value += dataToSend.byteLength
    } catch (error: any) {
      console.error('Send error:', error)
      ElMessage.error(`发送失败: ${error.message}`)
      throw error // Re-throw to let caller know
    } finally {
        if (writer) {
            writer.releaseLock()
            writer = undefined
        }
    }
  }
  
  const setSignals = async (signals: SerialOutputSignals) => {
      if (!port.value || !isConnected.value) return
      try {
          await port.value.setSignals(signals)
      } catch (error: any) {
          console.error('Error setting signals:', error)
          ElMessage.error(`设置信号失败: ${error.message}`)
      }
  }

  return {
    port,
    isConnected,
    requestPort,
    openPort,
    closePort,
    send,
    onData,
    setSignals,
    rxCount,
    txCount,
    resetCounts
  }
}
