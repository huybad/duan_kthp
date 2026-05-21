const API_URL = '/api/graduation-results';

let studentsMap = {};
let studentsByCode = {};
let studentsByName = {};
let conditionsMap = {};
let usedStudentIds = new Set();

document.addEventListener('DOMContentLoaded', async () => {
    await loadStudents();
    await loadConditions();
    fetchResults();

    const form = document.getElementById('resultForm');
    const cancelBtn = document.getElementById('cancelBtn');
    const studentCodeInput = document.getElementById('studentCodeInput');
    const studentNameInput = document.getElementById('studentName');

    function autoCalculate() {
        const conditionId = document.getElementById('conditionId').value;
        const gpa = parseFloat(document.getElementById('gpa').value) || 0;
        const totalCredits = parseInt(document.getElementById('totalCredits').value) || 0;
        const failedCredits = parseInt(document.getElementById('failedCredits').value) || 0;

        let classification = 4;
        if (gpa >= 3.6) classification = 1;
        else if (gpa >= 3.2) classification = 2;
        else if (gpa >= 2.5) classification = 3;
        
        document.getElementById('classification').value = classification;

        if (conditionId && conditionsMap[conditionId]) {
            const condition = conditionsMap[conditionId];
            if (gpa >= condition.minGpa && totalCredits >= condition.minTotalCredits && failedCredits === 0) {
                document.getElementById('result').value = 1;
            } else {
                document.getElementById('result').value = 0;
            }
        }
    }

    function selectConditionByCohort(cohort) {
        if (!cohort) return;
        for (let conditionId in conditionsMap) {
            if (conditionsMap[conditionId].appliedCohort.toLowerCase() === cohort.toLowerCase()) {
                document.getElementById('conditionId').value = conditionId;
                break;
            }
        }
    }

    studentCodeInput.addEventListener('input', (e) => {
        const code = e.target.value.trim().toUpperCase();
        if (studentsByCode[code]) {
            studentNameInput.value = studentsByCode[code].name;
            document.getElementById('gpa').value = studentsByCode[code].gpa;
            document.getElementById('totalCredits').value = studentsByCode[code].earnedCredits;
            selectConditionByCohort(studentsByCode[code].cohort);
            autoCalculate();
        }
    });

    studentNameInput.addEventListener('input', (e) => {
        const name = e.target.value.trim();
        if (studentsByName[name]) {
            studentCodeInput.value = studentsByName[name].code;
            document.getElementById('gpa').value = studentsByName[name].gpa;
            document.getElementById('totalCredits').value = studentsByName[name].earnedCredits;
            selectConditionByCohort(studentsByName[name].cohort);
            autoCalculate();
        }
    });

    document.getElementById('conditionId').addEventListener('change', autoCalculate);
    document.getElementById('gpa').addEventListener('input', autoCalculate);
    document.getElementById('totalCredits').addEventListener('input', autoCalculate);
    document.getElementById('failedCredits').addEventListener('input', autoCalculate);

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const id = document.getElementById('resultId').value;
        const codeInput = document.getElementById('studentCodeInput').value.trim().toUpperCase();
        
        let finalStudentId = "";
        if (studentsByCode[codeInput]) {
            finalStudentId = studentsByCode[codeInput].id;
        } else {
            // Fallback: convert any text to UUID format
            let hex = "";
            for(let i=0; i<codeInput.length; i++) {
                hex += codeInput.charCodeAt(i).toString(16);
            }
            hex = hex.padEnd(32, '0').substring(0, 32);
            finalStudentId = `${hex.substring(0,8)}-${hex.substring(8,12)}-${hex.substring(12,16)}-${hex.substring(16,20)}-${hex.substring(20,32)}`;
        }
        
        const payload = {
            studentId: finalStudentId,
            conditionId: document.getElementById('conditionId').value,
            gpa: parseFloat(document.getElementById('gpa').value) || 0,
            totalCredits: parseInt(document.getElementById('totalCredits').value) || 0,
            failedCredits: parseInt(document.getElementById('failedCredits').value) || 0,
            result: parseInt(document.getElementById('result').value),
            classification: parseInt(document.getElementById('classification').value),
            decisionDate: document.getElementById('decisionDate').value || null,
            note: document.getElementById('note').value
        };

        try {
            if (id) {
                // Update
                const response = await fetch(`${API_URL}/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                if (response.ok) {
                    resetForm();
                    fetchResults();
                } else {
                    alert('Cập nhật thất bại');
                }
            } else {
                // Create
                const response = await fetch(API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                if (response.ok) {
                    resetForm();
                    fetchResults();
                } else {
                    alert('Thêm mới thất bại');
                }
            }
        } catch (error) {
            console.error('Error saving result:', error);
            alert('Có lỗi xảy ra khi lưu.');
        }
    });

    cancelBtn.addEventListener('click', resetForm);
});

async function fetchResults() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        
        usedStudentIds.clear();
        data.forEach(r => usedStudentIds.add(r.studentId));
        
        renderTable(data);
        updateDatalists();
    } catch (error) {
        console.error('Error fetching results:', error);
    }
}

function updateDatalists() {
    const codeList = document.getElementById('studentCodesList');
    const nameList = document.getElementById('studentNamesList');
    if (codeList) codeList.innerHTML = '';
    if (nameList) nameList.innerHTML = '';

    for (const id in studentsMap) {
        if (!usedStudentIds.has(id)) {
            const s = studentsMap[id];
            if (codeList) {
                const optCode = document.createElement('option');
                optCode.value = s.code;
                codeList.appendChild(optCode);
            }
            if (nameList) {
                const optName = document.createElement('option');
                optName.value = s.name;
                nameList.appendChild(optName);
            }
        }
    }
}

async function loadConditions() {
    try {
        const response = await fetch('/api/graduation-conditions');
        const data = await response.json();
        const select = document.getElementById('conditionId');
        select.innerHTML = '<option value="">-- Chọn điều kiện --</option>';
        data.forEach(c => {
            conditionsMap[c.id] = c;
            const option = document.createElement('option');
            option.value = c.id;
            option.textContent = `${c.appliedCohort} (Tín chỉ: ${c.minTotalCredits}, GPA: ${c.minGpa})`;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Error fetching conditions:', error);
    }
}

async function loadStudents() {
    try {
        const response = await fetch('/api/students');
        const data = await response.json();

        data.forEach(s => {
            studentsMap[s.id] = { code: s.studentCode, name: s.name, gpa: s.gpa, earnedCredits: s.earnedCredits, cohort: s.cohort };
            studentsByCode[s.studentCode.toUpperCase()] = { id: s.id, name: s.name, gpa: s.gpa, earnedCredits: s.earnedCredits, cohort: s.cohort };
            studentsByName[s.name] = { id: s.id, code: s.studentCode, gpa: s.gpa, earnedCredits: s.earnedCredits, cohort: s.cohort };
        });
    } catch (error) {
        console.error('Error fetching students:', error);
    }
}

function renderTable(results) {
    const tbody = document.getElementById('resultTableBody');
    tbody.innerHTML = '';

    const classifications = {
        1: 'Xuất sắc',
        2: 'Giỏi',
        3: 'Khá',
        4: 'Trung bình'
    };

    results.forEach(result => {
        const tr = document.createElement('tr');
        
        const studentInfo = studentsMap[result.studentId] || { code: result.studentId ? result.studentId.substring(0, 8) + '...' : 'N/A', name: 'N/A' };
        const resText = result.result === 1 ? '<span style="color: #4ade80;">Đạt</span>' : '<span style="color: #f87171;">Không đạt</span>';
        const classText = classifications[result.classification] || 'N/A';
        const dateText = result.decisionDate || 'N/A';

        tr.innerHTML = `
            <td title="${result.studentId}"><strong>${studentInfo.code}</strong></td>
            <td>${studentInfo.name}</td>
            <td><strong>${result.gpa}</strong></td>
            <td>${result.totalCredits}</td>
            <td>${resText}</td>
            <td>${classText}</td>
            <td>${dateText}</td>
            <td>
                <button onclick='editResult(${JSON.stringify(result)})' class="btn btn-sm btn-info"><i class="fas fa-edit"></i></button>
                <button onclick="deleteResult('${result.id}')" class="btn btn-sm btn-danger"><i class="fas fa-trash"></i></button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function editResult(result) {
    document.getElementById('resultId').value = result.id;
    
    if (studentsMap[result.studentId]) {
        document.getElementById('studentCodeInput').value = studentsMap[result.studentId].code;
        document.getElementById('studentName').value = studentsMap[result.studentId].name;
    } else {
        document.getElementById('studentCodeInput').value = result.studentId.substring(0, 8);
        document.getElementById('studentName').value = '';
    }
    
    document.getElementById('conditionId').value = result.conditionId;
    document.getElementById('gpa').value = result.gpa;
    document.getElementById('totalCredits').value = result.totalCredits;
    document.getElementById('failedCredits').value = result.failedCredits;
    document.getElementById('result').value = result.result;
    document.getElementById('classification').value = result.classification;
    document.getElementById('decisionDate').value = result.decisionDate || '';
    document.getElementById('note').value = result.note || '';

    document.getElementById('submitBtn').textContent = 'Cập nhật';
    document.getElementById('cancelBtn').style.display = 'inline-block';
    
    // Scroll to top to see form
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

async function deleteResult(id) {
    if (!confirm('Bạn có chắc chắn muốn xóa kết quả này?')) return;

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });
        if (response.ok) {
            fetchResults();
        } else {
            alert('Xóa thất bại');
        }
    } catch (error) {
        console.error('Error deleting result:', error);
    }
}

function resetForm() {
    document.getElementById('resultForm').reset();
    document.getElementById('resultId').value = '';
    document.getElementById('studentCodeInput').value = '';
    document.getElementById('studentName').value = '';
    document.getElementById('submitBtn').textContent = 'Lưu Kết Quả';
    document.getElementById('cancelBtn').style.display = 'none';
}
