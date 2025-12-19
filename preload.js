// const { contextBridge, ipcRenderer } = require('electron');

// contextBridge.exposeInMainWorld('api', {
//   getEmployees: () => ipcRenderer.invoke('get-employees'),
//   addEmployee: (emp) => ipcRenderer.invoke('add-employee', emp),
//   updateEmployee: (emp) => ipcRenderer.invoke('update-employee', emp),
//   deleteEmployee: (id) => ipcRenderer.invoke('delete-employee', id),
//   generatePayslip: (data) => ipcRenderer.invoke('generate-payslip', data),
//   generatePreviewPdf: (data) =>
//    ipcRenderer.invoke('generate-payslip-pdf', data)
// });


const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  getEmployees: () => ipcRenderer.invoke('get-employees'),
  addEmployee: (emp) => ipcRenderer.invoke('add-employee', emp),
  updateEmployee: (emp) => ipcRenderer.invoke('update-employee', emp),
  deleteEmployee: (id) => ipcRenderer.invoke('delete-employee', id),
  generatePayslipPdf: (data) =>
    ipcRenderer.invoke('generate-payslip-pdf', data)
});
