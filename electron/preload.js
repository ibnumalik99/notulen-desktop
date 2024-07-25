const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    startMeeting: () => ipcRenderer.invoke('start-meeting'),
    stopMeeting: () => ipcRenderer.invoke('stop-meeting')
});
