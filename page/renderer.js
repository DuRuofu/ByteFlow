const btn1 = document.getElementById('btn1')
const information = document.getElementById('info')

// information.innerText = `本应用正在使用 Chrome (v${versions.chrome()}), Node.js (v${versions.node()}), 和 Electron (v${versions.electron()})`
information.innerText = `测试`

btn1.addEventListener('click', () => { 
	alert('Hello World!')
})
