const fs = require('fs');
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const db = require('./utils/db');


function createWindow() {
  // const win = new BrowserWindow({
  //   width: 1300,
  //   height: 800,
  //   webPreferences: {
  //     preload: path.join(__dirname, 'preload.js')
  //   }
  // });
  const win = new BrowserWindow({
  width: 1300,
  height: 800,
  icon: path.join(__dirname, 'assets/icon.ico'),
  webPreferences: {
    preload: path.join(__dirname, 'preload.js')
  }
});


  win.loadFile('renderer/index.html');


}

app.whenReady().then(() => {
  db.init(); // initialize database
  createWindow();
});

// IPC for CRUD
ipcMain.handle('get-employees', () => {
  return db.getEmployees();
});

ipcMain.handle('add-employee', (event, emp) => {
  return db.addEmployee(emp);
});

ipcMain.handle('update-employee', (event, emp) => {
  return db.updateEmployee(emp);
});

ipcMain.handle('delete-employee', (event, id) => {
  return db.deleteEmployee(id);
});



// ipcMain.handle('generate-payslip-pdf', async (event, data) => {
//   const win = new BrowserWindow({
//     show: false,
//     webPreferences: { offscreen: true }
//   });

//   const htmlPath = path.join(__dirname, 'renderer/pdfTemplate.html');
//   const cssPath = path.join(__dirname, 'renderer/pdf.css');

//   let html = fs.readFileSync(htmlPath, 'utf8');
//   const css = fs.readFileSync(cssPath, 'utf8');

//   // 🔥 INLINE CSS (IMPORTANT)
//   html = html.replace(
//     '</head>',
//     `<style>${css}</style></head>`
//   );

//   Object.entries(data.templateData).forEach(([key, value]) => {
//     html = html.replaceAll(`{{${key}}}`, value);
//   });

//   await win.loadURL(
//     'data:text/html;charset=utf-8,' + encodeURIComponent(html)
//   );

// const pdfBuffer = await win.webContents.printToPDF({
//   printBackground: true,
//   pageSize: 'A4'
// });


//   const fileName = `${data.employeeName}_${data.month}_${data.year}_Payslip.pdf`;
//   const filePath = path.join(app.getPath('documents'), fileName);

//   fs.writeFileSync(filePath, pdfBuffer);
//   require('electron').shell.openPath(filePath);

//   win.close();
// });


// ipcMain.handle('generate-payslip-pdf', async (event, data) => {
//   const win = new BrowserWindow({
//     show: false,
//     webPreferences: { offscreen: true }
//   });

//   const htmlPath = path.join(__dirname, 'renderer/pdfTemplate.html');
//   const cssPath = path.join(__dirname, 'renderer/pdf.css');

//   let html = fs.readFileSync(htmlPath, 'utf8');
//   const css = fs.readFileSync(cssPath, 'utf8');

//   // INLINE CSS
//   html = html.replace('</head>', `<style>${css}</style></head>`);

//   Object.entries(data.templateData).forEach(([key, value]) => {
//     html = html.replaceAll(`{{${key}}}`, value);
//   });

//   await win.loadURL(
//     'data:text/html;charset=utf-8,' + encodeURIComponent(html)
//   );

//   const pdfBuffer = await win.webContents.printToPDF({
//     printBackground: true,
//     pageSize: 'A4'
//   });

//   // 🔥 SAVE IN PROJECT /db FOLDER
//   const fileName = `${data.employeeName}_${data.month}_${data.year}_Payslip.pdf`;
//   const filePath = path.join(__dirname, 'db', fileName);

//   fs.writeFileSync(filePath, pdfBuffer);

//   require('electron').shell.openPath(filePath);
//   win.close();
// });

ipcMain.handle('generate-payslip-pdf', async (event, data) => {
  const win = new BrowserWindow({
    show: false,
    webPreferences: { offscreen: true }
  });

  const htmlPath = path.join(__dirname, 'renderer/pdfTemplate.html');
  const cssPath = path.join(__dirname, 'renderer/pdf.css');
  const logoPath = path.join(__dirname, 'renderer/logo.png');

  let html = fs.readFileSync(htmlPath, 'utf8');
  const css = fs.readFileSync(cssPath, 'utf8');

  // ✅ INLINE CSS
  html = html.replace('</head>', `<style>${css}</style></head>`);

  // ✅ LOGO BASE64 (THIS WAS MISSING)
  const logoBase64 = fs.readFileSync(logoPath).toString('base64');
  html = html.replace('{{LOGO_BASE64}}', logoBase64);

  // ✅ TEMPLATE DATA
  Object.entries(data.templateData).forEach(([key, value]) => {
    html = html.replaceAll(`{{${key}}}`, value);
  });

  await win.loadURL(
    'data:text/html;charset=utf-8,' + encodeURIComponent(html)
  );

  const pdfBuffer = await win.webContents.printToPDF({
    printBackground: true,
    pageSize: 'A4'
  });

  // ✅ SAVE IN /db FOLDER
  const fileName = `${data.employeeName}_${data.month}_${data.year}_Payslip.pdf`;
  
// ✅ Replace with
const payslipDir = path.join(app.getPath('documents'), 'Payslips');
if (!fs.existsSync(payslipDir)) {
  fs.mkdirSync(payslipDir, { recursive: true });
}
const filePath = path.join(payslipDir, fileName);

  fs.writeFileSync(filePath, pdfBuffer);
  require('electron').shell.openPath(filePath);

  win.close();
});
