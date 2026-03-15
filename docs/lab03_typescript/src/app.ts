import { Student } from "./models/Student.js";
import { StudentManager } from "./managers/StudentManager.js";
import { showList } from "./utils/showList.js";

const manager = new StudentManager();
manager.loadFromLocalStorage();

function renderTable(elementId: string = "studentTableBody"): void {
  const tableBody = document.getElementById(elementId)!;
  tableBody.innerHTML = "";
  const students = manager.getAllStudents();
  showList<Student>(students);

  students.forEach((s) => {
    tableBody.innerHTML += `
      <tr>
        <td>${s.id}</td>
        <td>${s.title_name}</td>
        <td>${s.first_name}</td>
        <td>${s.last_name}</td>
        <td>${s.email}</td>
        <td>${s.year}</td>
        <td>${s.major}</td>
      </tr>
    `;
  });
}

// ปุ่มเพิ่มนักศึกษา
(document.getElementById("addBtn") as HTMLButtonElement).onclick = () => {
  const id = (document.getElementById("id") as HTMLInputElement).value;
  const title_name = (document.getElementById("title_name") as HTMLInputElement).value;
  const first_name = (document.getElementById("first_name") as HTMLInputElement).value;
  const last_name = (document.getElementById("last_name") as HTMLInputElement).value;
  const email = (document.getElementById("email") as HTMLInputElement).value;
  const year = Number((document.getElementById("year") as HTMLInputElement).value);
  const major = (document.getElementById("major") as HTMLInputElement).value;

  const student: Student = { id, title_name, first_name, last_name, email, year, major };
  manager.addStudent(student);
  renderTable();
};

// ปุ่มค้นหาด้วยชื่อ
(document.getElementById("searchNameBtn") as HTMLButtonElement).onclick = () => {
  const keyword = (document.getElementById("searchName") as HTMLInputElement).value;
  const results = manager.findStudentsByName(keyword);
  renderTable("studentTableBody");

  const tableBody = document.getElementById("studentTableBody")!;
  tableBody.innerHTML = "";
  results.forEach((s) => {
    tableBody.innerHTML += `
      <tr>
        <td>${s.id}</td>
        <td>${s.title_name}</td>
        <td>${s.first_name}</td>
        <td>${s.last_name}</td>
        <td>${s.email}</td>
        <td>${s.year}</td>
        <td>${s.major}</td>
      </tr>
    `;
  });
  alert(`พบ ${results.length} คน`);
};

// ปุ่มค้นหาด้วยสาขา
(document.getElementById("searchMajorBtn") as HTMLButtonElement).onclick = () => {
  const keyword = (document.getElementById("searchMajor") as HTMLInputElement).value;
  const results = manager.findStudentsByMajor(keyword);

  const tableBody = document.getElementById("studentTableBody")!;
  tableBody.innerHTML = "";
  results.forEach((s) => {
    tableBody.innerHTML += `
      <tr>
        <td>${s.id}</td>
        <td>${s.title_name}</td>
        <td>${s.first_name}</td>
        <td>${s.last_name}</td>
        <td>${s.email}</td>
        <td>${s.year}</td>
        <td>${s.major}</td>
      </tr>
    `;
  });
  alert(`พบ ${results.length} คน`);
};

// ปุ่มค้นหาด้วย Email
(document.getElementById("searchEmailBtn") as HTMLButtonElement).onclick = () => {
  const emailKeyword = (document.getElementById("searchEmail") as HTMLInputElement).value;
  const result = manager.findStudentByEmail(emailKeyword);

  const tableBody = document.getElementById("studentTableBody")!;
  tableBody.innerHTML = "";

  if (result) {
    tableBody.innerHTML += `
      <tr>
        <td>${result.id}</td>
        <td>${result.title_name}</td>
        <td>${result.first_name}</td>
        <td>${result.last_name}</td>
        <td>${result.email}</td>
        <td>${result.year}</td>
        <td>${result.major}</td>
      </tr>
    `;
    alert(`พบนักศึกษา: ${result.first_name} ${result.last_name}`);
  } else {
    alert("ไม่พบนักศึกษาที่มี Email นี้");
  }
};

// แสดงตารางตอนโหลดหน้า
renderTable();