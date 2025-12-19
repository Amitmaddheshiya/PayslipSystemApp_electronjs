const sqlite3 = require('sqlite3').verbose();
const path = require('path');

let db;

function init() {
  db = new sqlite3.Database(path.join(__dirname, '../db/database.sqlite'));
  db.serialize(() => {
    db.run(`
      CREATE TABLE IF NOT EXISTS employees(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        employeeId TEXT,
        designation TEXT,
        department TEXT,
        doj TEXT,
        location TEXT,
        bankName TEXT,
        accountNumber TEXT,
        ifsc TEXT,
        pfNo TEXT,
        pfUAN TEXT,
        esiNo TEXT,
        pan TEXT,
        basic REAL,
        hra REAL,
        specialAllowance REAL
      )
    `);
  });
}

function getEmployees() {
  return new Promise((resolve, reject) => {
    db.all(`SELECT * FROM employees`, [], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

function addEmployee(emp) {
  return new Promise((resolve, reject) => {
    const stmt = db.prepare(`
      INSERT INTO employees
      (name, employeeId, designation, department, doj, location, bankName, accountNumber, ifsc, pfNo, pfUAN, esiNo, pan, basic, hra, specialAllowance)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run([
      emp.name, emp.employeeId, emp.designation, emp.department, emp.doj,
      emp.location, emp.bankName, emp.accountNumber, emp.ifsc,
      emp.pfNo, emp.pfUAN, emp.esiNo, emp.pan,
      emp.basic, emp.hra, emp.specialAllowance
    ], function(err) {
      if (err) reject(err);
      else resolve(this.lastID);
    });
    stmt.finalize();
  });
}

function updateEmployee(emp) {
  return new Promise((resolve, reject) => {
    db.run(`
      UPDATE employees SET
        name=?, employeeId=?, designation=?, department=?, doj=?,
        location=?, bankName=?, accountNumber=?, ifsc=?,
        pfNo=?, pfUAN=?, esiNo=?, pan=?, basic=?, hra=?, specialAllowance=?
      WHERE id=?
    `, [
      emp.name, emp.employeeId, emp.designation, emp.department, emp.doj,
      emp.location, emp.bankName, emp.accountNumber, emp.ifsc,
      emp.pfNo, emp.pfUAN, emp.esiNo, emp.pan,
      emp.basic, emp.hra, emp.specialAllowance, emp.id
    ], function(err) {
      if (err) reject(err);
      else resolve();
    });
  });
}

function deleteEmployee(id) {
  return new Promise((resolve, reject) => {
    db.run(`DELETE FROM employees WHERE id=?`, [id], function(err) {
      if (err) reject(err);
      else resolve();
    });
  });
}

module.exports = { init, getEmployees, addEmployee, updateEmployee, deleteEmployee };
