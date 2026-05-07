const API_URL = '/api/graduation-results';

document.addEventListener('DOMContentLoaded', () => {
    fetchResults();
    loadConditions();

    const form = document.getElementById('resultForm');
    const cancelBtn = document.getElementById('cancelBtn');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const id = document.getElementById('resultId').value;
        
        // Helper function to allow users to type normal text (like "Huy", "123") and silently convert it to a valid UUID format for the backend
        const toUUID = (str) => {
            if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str)) return str;
            let hex = "";
            for(let i=0; i<str.length; i++) {
                hex += str.charCodeAt(i).toString(16);
            }
            hex = hex.padEnd(32, '0').substring(0, 32);
            return `${hex.substring(0,8)}-${hex.substring(8,12)}-${hex.substring(12,16)}-${hex.substring(16,20)}-${hex.substring(20,32)}`;
        };
        
        const payload = {
            studentId: toUUID(document.getElementById('studentId').value),
            conditionId: document.getElementById('conditionId').value,
            gpa: parseFloat(document.getElementById('gpa').value),
            totalCredits: parseInt(document.getElementById('totalCredits').value),
            failedCredits: parseInt(document.getElementById('failedCredits').value),
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
        renderTable(data);
    } catch (error) {
        console.error('Error fetching results:', error);
    }
}

async function loadConditions() {
    try {
        const response = await fetch('/api/graduation-conditions');
        const data = await response.json();
        const select = document.getElementById('conditionId');
        select.innerHTML = '<option value="">-- Chọn điều kiện --</option>';
        data.forEach(c => {
            const option = document.createElement('option');
            option.value = c.id;
            option.textContent = `${c.appliedCohort} (Tín chỉ: ${c.minTotalCredits}, GPA: ${c.minGpa})`;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Error fetching conditions:', error);
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
        
        const shortStudentId = result.studentId ? result.studentId.substring(0, 8) + '...' : 'N/A';
        const resText = result.result === 1 ? '<span style="color: #4ade80;">Đạt</span>' : '<span style="color: #f87171;">Không đạt</span>';
        const classText = classifications[result.classification] || 'N/A';
        const dateText = result.decisionDate || 'N/A';

        tr.innerHTML = `
            <td title="${result.studentId}">${shortStudentId}</td>
            <td>${result.gpa}</td>
            <td>${result.totalCredits}</td>
            <td>${resText}</td>
            <td>${classText}</td>
            <td>${dateText}</td>
            <td>
                <button class="btn-edit" onclick='editResult(${JSON.stringify(result)})'>Sửa</button>
                <button class="btn-delete" onclick="deleteResult('${result.id}')">Xóa</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function editResult(result) {
    document.getElementById('resultId').value = result.id;
    document.getElementById('studentId').value = result.studentId;
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
    document.getElementById('submitBtn').textContent = 'Lưu Kết Quả';
    document.getElementById('cancelBtn').style.display = 'none';
}
