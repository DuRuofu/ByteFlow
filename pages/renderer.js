const btn1 = document.getElementById('btn1')
const btn2 = document.getElementById('btn2')
const input = document.getElementById('input')

const information = document.getElementById('info')

information.innerText = `本应用正在使用 Chrome (v${api.versions.chrome()}), Node.js (v${api.versions.node()}), 和 Electron (v${api.versions.electron()})`

// 为按钮1添加点击事件
btn1.addEventListener('click', () => { 
	alert('Hello World!')
})


// 为按钮2添加点击事件
btn2.addEventListener('click', () => {
	alert(input.value)
	api.saveFile(input.value)
})

