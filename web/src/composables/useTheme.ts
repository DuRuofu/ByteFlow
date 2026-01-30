import { ref, watchEffect } from 'vue'

const isDark = ref(true) // 默认暗色

export function useTheme() {
  const toggleTheme = () => {
    isDark.value = !isDark.value
  }

  // 监听变化并应用到 html 标签
  watchEffect(() => {
    const html = document.documentElement
    if (isDark.value) {
      html.classList.add('dark')
      // 保存设置
      localStorage.setItem('byteflow-theme', 'dark')
    } else {
      html.classList.remove('dark')
      localStorage.setItem('byteflow-theme', 'light')
    }
  })

  // 初始化读取
  const initTheme = () => {
    const saved = localStorage.getItem('byteflow-theme')
    if (saved) {
      isDark.value = saved === 'dark'
    } else {
        // 默认暗色
        isDark.value = true
    }
  }

  return {
    isDark,
    toggleTheme,
    initTheme
  }
}
