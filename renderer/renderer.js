// ================= EMPLOYEE MANAGEMENT =================
let lastPayslipData = null;

const companyDetails = {
  nextview: {
    name: "Nextview Technologies (INDIA) Pvt Ltd",
    address: `409-410 Maurya Atria,
Nr. Atithi Restaurant Cross Road,
Bodakdev, Ahmedabad-380054`,
    phone: "1800 270 0139, 9925149964",
    email: "info@nexttechgroup.com"
  },
  "3view": {
    name: "3 View Trade LLP",
    address: `T F 3, Shakti Square,
Opp Management Enclave,
Nehru Park Road, Vastrapur,
Ahmedabad 380015`,
    phone: "9904310022",
    email: "info@nexttechgroup.com"
  },
  nexttech: {
    name: "Next Tech IT'S Care",
    address: `409-410 Maurya Atria,
Nr. Atithi Hotel,
Near Kasturi Tower,
Bodakdev, Ahmedabad-380054`,
    phone: "9033009558, 9510529827",
    email: "info@nexttechgroup.com"
  }
};



const form = document.getElementById('employeeForm');
const employeeList = document.getElementById('employeeList');

let editingId = null;

async function loadEmployees() {
  const employees = await window.api.getEmployees();
  employeeList.innerHTML = '';

  employees.forEach(emp => {
    const li = document.createElement('li');
    li.textContent = `${emp.name} - ${emp.designation}`;

    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.onclick = () => editEmployee(emp);

    const delBtn = document.createElement('button');
    delBtn.textContent = 'Delete';
    delBtn.onclick = async () => {
      await window.api.deleteEmployee(emp.id);
      loadEmployees();
      loadEmployeeSelect();
    };

    li.appendChild(editBtn);
    li.appendChild(delBtn);
    employeeList.appendChild(li);
  });

  loadEmployeeSelect();
}

function editEmployee(emp) {
  const name = document.getElementById('name');
   const locationInput = document.getElementById('location'); // ✅ FIX
  editingId = emp.id;

  empId.value = emp.id;
  name.value = emp.name;
  employeeId.value = emp.employeeId;
  designation.value = emp.designation;
  department.value = emp.department;
  company.value = emp.company;   // ✅ ADD THIS
  doj.value = emp.doj;
  locationInput.value = emp.location;
  bankName.value = emp.bankName;
  accountNumber.value = emp.accountNumber;
  ifsc.value = emp.ifsc;
  pfNo.value = emp.pfNo;
  pfUAN.value = emp.pfUAN;
  pan.value = emp.pan;
  basic.value = emp.basic;
  hra.value = emp.hra;
  specialAllowance.value = emp.specialAllowance;
}

form.addEventListener('submit', async e => {
  const name = document.getElementById('name');
  e.preventDefault();

  const emp = {
    id: editingId,
    name: name.value,
    employeeId: employeeId.value,
    designation: designation.value,
    department: department.value,
    company: company.value,   // ✅ ADD THIS
    doj: doj.value,
    location: document.getElementById('location').value, // ✅ FIX
    bankName: bankName.value,
    accountNumber: accountNumber.value,
    ifsc: ifsc.value,
    pfNo: pfNo.value,
    pfUAN: pfUAN.value,
    pan: pan.value,
    basic: Number(basic.value) || 0,
    hra: Number(hra.value) || 0,
    specialAllowance: Number(specialAllowance.value) || 0
  };

  if (editingId) {
    await window.api.updateEmployee(emp);
    editingId = null;
  } else {
    await window.api.addEmployee(emp);
  }

  form.reset();
  loadEmployees();
});

// ================= PAYSLIP =================
const employeeSelect = document.getElementById('employeeSelect');
const payslipForm = document.getElementById('payslipForm');

async function loadEmployeeSelect() {
  const employees = await window.api.getEmployees();
  employeeSelect.innerHTML = '';

  employees.forEach(emp => {
    const opt = document.createElement('option');
    opt.value = emp.id;
    opt.textContent = emp.name;
    employeeSelect.appendChild(opt);
  });

  setTimeout(toggleDeductionCheckboxByEmployee, 100);

}

const pfCheck = document.getElementById('pfCheck');
const ptCheck = document.getElementById('ptCheck');
const pfStatus = document.getElementById('pfStatus');
const ptStatus = document.getElementById('ptStatus');
const deductionSection = document.getElementById('deductionCheckboxSection');


function updateDeductionStatus() {
  pfStatus.innerText = pfCheck.checked ? "YES" : "NO";
  ptStatus.innerText = ptCheck.checked ? "YES" : "NO";
}

pfCheck.addEventListener('change', updateDeductionStatus);
ptCheck.addEventListener('change', updateDeductionStatus);

// initial load
updateDeductionStatus();

async function toggleDeductionCheckboxByEmployee() {
  const empId = Number(employeeSelect.value);
  const employees = await window.api.getEmployees();
  const emp = employees.find(e => e.id === empId);

  if (!emp) return;

  if (emp.company === "nextview") {
    deductionSection.style.display = "block";
    pfCheck.checked = true;
    ptCheck.checked = true;
  } else {
    deductionSection.style.display = "none";
    pfCheck.checked = false;
    ptCheck.checked = false;
  }

  updateDeductionStatus();
}
employeeSelect.addEventListener('change', toggleDeductionCheckboxByEmployee);



payslipForm.addEventListener('submit', async e => {
  e.preventDefault();

  const empId = Number(employeeSelect.value);
  const employees = await window.api.getEmployees();
  const emp = employees.find(x => x.id === empId);
  

  const month = Number(monthSelect.value);
  const year = Number(yearSelect.value);
  const presentDays = Number(attendance.value);
  const totalDays = new Date(year, month, 0).getDate();

  const monthName = new Date(year, month - 1)
    .toLocaleString('default', { month: 'long' })
    .toUpperCase();

  // ================= CALCULATION =================
  const gross = emp.basic + emp.hra + emp.specialAllowance;
  const earned = (gross / totalDays) * presentDays;

let pf = 0;
let pt = 0;

if (emp.company === "nextview") {

  if (pfCheck.checked) {
    pf = 1800;
  }

  if (ptCheck.checked) {
    pt = 200;
  }

}



// yearly & monthly salary
const monthlySalary = earned;
const yearlySalary = monthlySalary * 12;

// TDS RULE
let tds = 0;
if (yearlySalary > 1200000 || monthlySalary > 100000) {
  tds = monthlySalary * 0.10; // 10% example TDS
}

const totalDed = pf + pt + tds;
const net = earned - totalDed;


  // ================= SHOW PREVIEW =================
  payslipPreview.style.display = 'block';

  // HEADER
  pMonthYear.innerText = `${monthName} ${year}`;

  // EMPLOYEE DETAILS
  pName.innerText = emp.name;
  pEmpId.innerText = emp.employeeId;
  pDesig.innerText = emp.designation;
  pDept.innerText = emp.department;
  pDoj.innerText = emp.doj;
  pLocation.innerText = emp.location;
  pPan.innerText = emp.pan;
  pPfNo.innerText = emp.pfNo;
  pUan.innerText = emp.pfUAN;


  const basicActual = (emp.basic / totalDays) * presentDays;
const hraActual = (emp.hra / totalDays) * presentDays;
const splActual = (emp.specialAllowance / totalDays) * presentDays;


  eBasicFull.innerText = `Rs. ${emp.basic.toFixed(2)}`;
// eBasicActual.innerText = `Rs. ${emp.basic.toFixed(2)}`;
eBasicActual.innerText = `Rs. ${basicActual.toFixed(2)}`;

eHraFull.innerText = `Rs. ${emp.hra.toFixed(2)}`;
// eHraActual.innerText = `Rs. ${emp.hra.toFixed(2)}`;
eHraActual.innerText = `Rs. ${hraActual.toFixed(2)}`;

eSplFull.innerText = `Rs. ${emp.specialAllowance.toFixed(2)}`;
// eSplActual.innerText = `Rs. ${emp.specialAllowance.toFixed(2)}`;
eSplActual.innerText = `Rs. ${splActual.toFixed(2)}`;









eTotalFull.innerText = `Rs. ${gross.toFixed(2)}`;
eTotalActual.innerText = `Rs. ${earned.toFixed(2)}`;

dPf.innerText = `Rs. ${pf.toFixed(2)}`;
dPt.innerText = `Rs. ${pt.toFixed(2)}`;
dTds.innerText = `Rs. ${tds.toFixed(2)}`;
dTotal.innerText = `Rs. ${totalDed.toFixed(2)}`;


  // ATTENDANCE
  aTotal.innerText = `${totalDays} days`;
  aPresent.innerText = `${presentDays} days`;
  aAbsent.innerText = `${totalDays - presentDays} days`;
  pPresentDays.innerText = `${presentDays} days`;


  // PAYMENT
  pBank.innerText = emp.bankName;
  pAcc.innerText = emp.accountNumber;
  pPeriod.innerText = `${monthName} ${year}`;

  // NET
  pNet.innerText = net.toFixed(2);
  pDays.innerText = `${presentDays}/${totalDays} days`;


  //
  // ================= COMPANY DETAILS =================
const comp = companyDetails[emp.company];

if (comp) {
  document.getElementById('pCompanyName').innerText = comp.name; // ✅ NEW
  document.getElementById('cName').innerText = comp.name;
  document.getElementById('cAddress').innerText = comp.address;
  document.getElementById('cPhone').innerText = comp.phone;
  document.getElementById('cEmail').innerText = comp.email;
} else {
  document.getElementById('cName').innerText = "-";
  document.getElementById('cAddress').innerText = "-";
  document.getElementById('cPhone').innerText = "-";
  document.getElementById('cEmail').innerText = "-";
}


  // ================= PDF =================
  

 lastPayslipData = {
  emp,
  monthName,
  year,
  earned,
  pf,
  pt,
  tds,
  totalDed,
  net,
  totalDays,
  presentDays
};
});


const downloadBtn = document.getElementById('downloadPdfBtn');

downloadBtn.addEventListener('click', async () => {
  if (!lastPayslipData) {
    alert('Please generate payslip preview first');
    return;
  }

  const {
    emp,
    monthName,
    year,
    earned,
    pf,
    pt,
    tds,
    totalDed,
    net,
    totalDays,
    presentDays
  } = lastPayslipData;

  const comp = companyDetails[emp.company];

await window.api.generatePayslipPdf({
  employeeName: emp.name,
  month: monthName,
  year,
  templateData: {

    // ===== EMPLOYEE =====
    NAME: emp.name,
    EMPID: emp.employeeId,
    DESIGNATION: emp.designation,
    DEPARTMENT: emp.department,
    DOJ: emp.doj,
    LOCATION: emp.location,
    PAN: emp.pan,
    PF: emp.pfNo,
    UAN: emp.pfUAN,

    // ===== COMPANY (NEW) =====
    COMPANY_NAME: comp?.name || "",
    COMPANY_ADDRESS: comp?.address || "",
    COMPANY_PHONE: comp?.phone || "",
    COMPANY_EMAIL: comp?.email || "",

    // ===== SALARY =====
    BASIC: emp.basic.toFixed(2),
    BASIC_A: ((emp.basic / totalDays) * presentDays).toFixed(2),

    HRA: emp.hra.toFixed(2),
    HRA_A: ((emp.hra / totalDays) * presentDays).toFixed(2),

    SPL: emp.specialAllowance.toFixed(2),
    SPL_A: ((emp.specialAllowance / totalDays) * presentDays).toFixed(2),

    TOTAL_FULL: (emp.basic + emp.hra + emp.specialAllowance).toFixed(2),
    TOTAL_ACTUAL: earned.toFixed(2),

    PF_AMT: pf.toFixed(2),
    PT: pt.toFixed(2),
    TDS: tds.toFixed(2),
    DED_TOTAL: totalDed.toFixed(2),

    TOTAL_DAYS: `${totalDays} days`,
    PRESENT_DAYS: `${presentDays} days`,
    ABSENT_DAYS: `${totalDays - presentDays} days`,

    BANK: emp.bankName,
    ACCOUNT: emp.accountNumber,
    MONTH_YEAR: `${monthName} ${year}`,
    NET: net.toFixed(2),
    NET_WORDS: convertNumberToWords(net)
  }
});

});

function convertNumberToWords(amount) {
  amount = Math.floor(Number(amount));

  if (isNaN(amount)) return "";

  const words = [
    "", "One", "Two", "Three", "Four", "Five",
    "Six", "Seven", "Eight", "Nine", "Ten",
    "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen",
    "Sixteen", "Seventeen", "Eighteen", "Nineteen"
  ];

  const tens = [
    "", "", "Twenty", "Thirty", "Forty",
    "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"
  ];

  function numToWords(n) {
    if (n < 20) return words[n];
    if (n < 100)
      return tens[Math.floor(n / 10)] + (n % 10 ? " " + words[n % 10] : "");
    if (n < 1000)
      return words[Math.floor(n / 100)] + " Hundred" +
        (n % 100 ? " " + numToWords(n % 100) : "");
    if (n < 100000)
      return numToWords(Math.floor(n / 1000)) + " Thousand" +
        (n % 1000 ? " " + numToWords(n % 1000) : "");
    if (n < 10000000)
      return numToWords(Math.floor(n / 100000)) + " Lakh" +
        (n % 100000 ? " " + numToWords(n % 100000) : "");
    return numToWords(Math.floor(n / 10000000)) + " Crore" +
      (n % 10000000 ? " " + numToWords(n % 10000000) : "");
  }

  return `Rupees ${numToWords(amount)} Only`;
}



// INIT
loadEmployees();
