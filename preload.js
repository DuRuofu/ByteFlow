console.log('preload.js loaded')
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('api', {
	versions: {
		node: () => process.versions.node,
		chrome: () => process.versions.chrome,
		electron: () => process.versions.electron,
	},

	saveFile: (data) => {
		console.log('saveFile', data)
		ipcRenderer.send('save-file', data)
	}
})

