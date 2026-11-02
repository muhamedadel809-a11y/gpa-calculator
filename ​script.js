let semesterCount = 0;

// إضافة ترم جديد بـ 4 مواد فاضية
function addSemester() {
    semesterCount++;
    const container = document.getElementById('semesters-container');
    if (!container) return;

    const semesterDiv = document.createElement('div');
    semesterDiv.className = 'semester-card';
    semesterDiv.id = `semester-${semesterCount}`;

    semesterDiv.innerHTML = `
        <div class="semester-header">
            <h3>Semester ${semesterCount}</h3>
            <button class="btn btn-delete" onclick="removeSemester(${semesterCount})">Remove Semester</button>
        </div>
        <div class="courses-list" id="courses-${semesterCount}"></div>
        <button class="btn btn-add-course" onclick="addCourse(${semesterCount})">+ Add Course</button>
    `;

    container.appendChild(semesterDiv);

    // إضافة 4 مواد فارغة
    for (let i = 0; i < 4; i++) {
        addCourse(semesterCount);
    }
}

// حذف ترم
function removeSemester(id) {
    const sem = document.getElementById(`semester-${id}`);
    if (sem) sem.remove();
    calculateGPA();
}

// إضافة مادة
function addCourse(semesterId) {
    const coursesList = document.getElementById(`courses-${semesterId}`);
    if (!coursesList) return;

    const row = document.createElement('div');
    row.className = 'course-row';

    row.innerHTML = `
        <input type="text" class="course-name" placeholder="Course Name">
        <input type="number" class="course-credit" placeholder="Credits" min="1" value="3" oninput="calculateGPA()">
        <select class="course-grade" onchange="calculateGPA()">
            <option value="">Grade</option>
            <option value="4.0">A / A+</option>
            <option value="3.7">A-</option>
            <option value="3.3">B+</option>
            <option value="3.0">B</option>
            <option value="2.7">B-</option>
            <option value="2.3">C+</option>
            <option value="2.0">C</option>
            <option value="1.7">C-</option>
            <option value="1.3">D+</option>
            <option value="1.0">D</option>
            <option value="0.0">F</option>
        </select>
        <button class="btn btn-delete" onclick="this.parentElement.remove(); calculateGPA();">✕</button>
    `;

    coursesList.appendChild(row);
    calculateGPA();
}

// حساب الـ GPA الكلي والعداد
function calculateGPA() {
    let totalPoints = 0;
    let totalCredits = 0;

    const rows = document.querySelectorAll('.course-row');
    rows.forEach(row => {
        const creditInput = row.querySelector('.course-credit, input[type="number"]');
        const gradeSelect = row.querySelector('.course-grade, select');

        if (creditInput && gradeSelect) {
            const credits = parseFloat(creditInput.value);
            const gradePoint = parseFloat(gradeSelect.value);

            if (!isNaN(credits) && credits > 0 && !isNaN(gradePoint)) {
                totalCredits += credits;
                totalPoints += credits * gradePoint;
            }
        }
    });

    const gpa = totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : "0.00";

    const gpaElem = document.getElementById('total-gpa') || document.getElementById('overall-gpa');
    const creditsElem = document.getElementById('total-credits');

    if (gpaElem) gpaElem.innerText = gpa;
    if (creditsElem) creditsElem.innerText = `Total Graded Credits: ${totalCredits}`;
}

// الانتقال بين الكفر والحاسبة
function goToCalculator() {
    const cover = document.getElementById('cover-page');
    const calc = document.getElementById('calculator-page');
    if (!cover || !calc) return;

    cover.style.display = 'none';
    calc.style.display = 'block';
    calc.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function goToCover() {
    const cover = document.getElementById('cover-page');
    const calc = document.getElementById('calculator-page');
    if (!cover || !calc) return;

    calc.style.display = 'none';
    cover.style.display = 'flex';
}

// التشغيل عند الفتح بترم فاضي مباشرة
window.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('semesters-container');
    if (container) {
        container.innerHTML = '';
        semesterCount = 0;
        addSemester();
    }
});