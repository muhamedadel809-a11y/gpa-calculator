let semesterCount = 0;

// إضافة ترم جديد
function addSemester() {
    semesterCount++;
    const container = document.getElementById('semesters-container');

    const semesterDiv = document.createElement('div');
    semesterDiv.className = 'semester-card';
    semesterDiv.id = `semester-${semesterCount}`;

    semesterDiv.innerHTML = `
        <div class="semester-header">
            <h3>الترم ${semesterCount}</h3>
            <button class="btn btn-delete" onclick="removeSemester(${semesterCount})">حذف الترم</button>
        </div>
        <div class="courses-list" id="courses-${semesterCount}"></div>
        <button class="btn btn-add-course" onclick="addCourse(${semesterCount})">+ إضافة مادة</button>
    `;

    container.appendChild(semesterDiv);

    // إضافة 4 مواد فارغة تلقائياً داخل الترم الجديد
    for (let i = 0; i < 4; i++) {
        addCourse(semesterCount);
    }
}

// حذف ترم
function removeSemester(id) {
  const sem = document.getElementById(`semester-${id}`);
  sem.remove();
  calculateGPA();
}

// إضافة مادة داخل ترم معين
function addCourse(semesterId) {
  const coursesList = document.getElementById(`courses-${semesterId}`);

  const row = document.createElement('div');
  row.className = 'course-row';

  row.innerHTML = `
    <input type="text" class="course-name" placeholder="اسم المادة">
    <input type="number" class="course-credit" placeholder="الساعات" min="1" oninput="calculateGPA()">
    <select class="course-grade" onchange="calculateGPA()">
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

// حساب الـ GPA الكلي
function calculateGPA() {
    let totalPoints = 0;
    let totalCredits = 0;

    // جلب جميع مدخلات الساعات والتقديرات في كل الأترام
    const creditsInputs = document.querySelectorAll('.course-credit, .course-hours-input, input[type="number"]');
    const gradeSelects = document.querySelectorAll('.course-grade, .course-grade-select, select');

    creditsInputs.forEach((input, index) => {
        const credits = parseFloat(input.value);
        const gradePoint = gradeSelects[index] ? parseFloat(gradeSelects[index].value) : NaN;

        if (!isNaN(credits) && credits > 0 && !isNaN(gradePoint)) {
            totalCredits += credits;
            totalPoints += credits * gradePoint;
        }
    });

    const gpa = totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : "0.00";

    // تحديث النتيجة في الشاشة لأي عنصر يحمل الـ ID
    const gpaElement = document.getElementById('overall-gpa') || document.getElementById('total-gpa') || document.querySelector('.gpa-number');
    const creditsElement = document.getElementById('total-credits') || document.querySelector('.total-credits');

    if (gpaElement) gpaElement.innerText = gpa;
    if (creditsElement) creditsElement.innerText = `Total Graded Credits: ${totalCredits}`;
}   

window.onload = function() {
    const container = document.getElementById('semesters-container');
    if (container) container.innerHTML = '';
    addSemester();
};
// حل شامل ورسمي لإضافة مادة في أي سيمستر
document.addEventListener('click', function (e) {
    // 1. البحث عن العنصر المضغوط عليه إذا كان يحتوي على كلمة Add Course أو +
    const btn = e.target.closest('button, .btn, div[role="button"]');
    if (!btn) return;

    const btnText = (btn.innerText || btn.textContent || '').trim().toLowerCase();

    if (btnText.includes('add course') || btnText.includes('إضافة مادة') || btnText.includes('+ course')) {
        e.preventDefault();
        
        // 2. تحديد حاوية الترم (Semester)
        const semesterBox = btn.closest('.semester-box') || btn.closest('.semester-card') || btn.closest('[id*="semester"]') || btn.parentElement;
        if (!semesterBox) return;

        // 3. البحث عن مكان الصفوف أو إضافتها قبل الزرار فوراً
        let coursesContainer = semesterBox.querySelector('.courses-container') || semesterBox.querySelector('.courses-list');
        const count = semesterBox.querySelectorAll('.course-row, .course-item').length + 1;

        const rowHtml = `
            <div class="course-row" style="display: flex; align-items: center; gap: 10px; width: 100%; margin-bottom: 10px;">
                <input type="text" class="course-name-input" placeholder="Course ${count} Name" style="flex: 2; background: #0b1120; border: 1px solid #1e293b; color: #f8fafc; padding: 10px 14px; border-radius: 8px; font-size: 0.9rem; outline: none;">
                <input type="number" class="course-hours-input" placeholder="Credits" min="1" max="10" value="3" style="width: 80px; background: #0b1120; border: 1px solid #1e293b; color: #f8fafc; padding: 10px; border-radius: 8px; font-size: 0.9rem; text-align: center; outline: none;">
                <select class="course-grade-select" style="width: 110px; background: #0b1120; border: 1px solid #1e293b; color: #f8fafc; padding: 10px; border-radius: 8px; font-size: 0.9rem; outline: none; cursor: pointer;">
                    <option value="">Grade</option>
                    <option value="4.0">A</option>
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
                <button type="button" onclick="this.parentElement.remove()" style="width: 42px; height: 42px; background: rgba(239, 68, 68, 0.1); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.25); border-radius: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 1.1rem; font-weight: bold; flex-shrink: 0;">✕</button>
            </div>
        `;

        if (coursesContainer) {
            coursesContainer.insertAdjacentHTML('beforeend', rowHtml);
        } else {
            btn.insertAdjacentHTML('beforebegin', rowHtml);
        }
    }
});
// تفريغ أي مواد قديمة وتحميل ترم فاضي بـ 4 مواد فور فتح الصفحة
// التغلب على أي دالة تحميل تلقائي قديمة وتفريغ المواد
window.addEventListener('load', () => {
    setTimeout(() => {
        const container = document.getElementById('semesters-container');
        if (!container) return;

        // تفريغ أي مواد قديمة نزلها السكريبت القديم
        container.innerHTML = '';
        
        // إعادة تصفير العداد إن وجد
        if (typeof semesterCount !== 'undefined') semesterCount = 0;

        // إضافة الترم الأول وجواه 4 مواد فاضية
        if (typeof addSemester === 'function') {
            addSemester();
        }
    }, 50); // تأخير بسيط لضمان مسح المواد المرفوعة تلقائياً
});