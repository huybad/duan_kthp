const API_URL = '/api/students';

// Tính toán xếp loại dựa trên GPA
function calculateClassification(gpa) {
    if (gpa >= 3.6) return '<span class="badge badge-success">Xuất sắc</span>';
    if (gpa >= 3.2) return '<span class="badge badge-primary">Giỏi</span>';
    if (gpa >= 2.5) return '<span class="badge badge-info">Khá</span>';
    return '<span class="badge badge-warning">Trung bình</span>';
}

// Lấy danh sách sinh viên
async function fetchStudents() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        const tbody = document.getElementById('studentTableBody');
        tbody.innerHTML = '';

        data.forEach(item => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong>${item.studentCode}</strong></td>
                <td>${item.name}</td>
                <td>${item.earnedCredits}</td>
                <td><strong>${item.gpa.toFixed(2)}</strong></td>
                <td>${item.cohort}</td>
                <td>${item.hasPhysicalEdu ? '<i class="fas fa-check text-success"></i>' : '<i class="fas fa-times text-danger"></i>'}</td>
                <td>${item.hasDefenseEdu ? '<i class="fas fa-check text-success"></i>' : '<i class="fas fa-times text-danger"></i>'}</td>
                <td>
                    <button onclick="editStudent('${item.id}')" class="btn btn-sm btn-info"><i class="fas fa-edit"></i></button>
                    <button onclick="deleteStudent('${item.id}')" class="btn btn-sm btn-danger"><i class="fas fa-trash"></i></button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
    }
}

// Xử lý form submit
document.getElementById('studentForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const id = document.getElementById('studentId').value;
    const payload = {
        name: document.getElementById('name').value,
        studentCode: document.getElementById('studentCode').value,
        dateOfBirth: document.getElementById('dateOfBirth').value || null,
        gender: document.getElementById('gender').value,
        idCardNumber: document.getElementById('idCardNumber').value,
        idCardIssuePlace: document.getElementById('idCardIssuePlace').value,
        address: document.getElementById('address').value,
        status: document.getElementById('status').value,
        recordStatus: document.getElementById('recordStatus').value,
        adminClass: document.getElementById('adminClass').value,
        major: document.getElementById('major').value,
        earnedCredits: parseInt(document.getElementById('earnedCredits').value) || 0,
        gpa: parseFloat(document.getElementById('gpa').value) || 0,
        cohort: document.getElementById('cohort').value,
        hasPhysicalEdu: document.getElementById('hasPhysicalEdu').checked,
        hasDefenseEdu: document.getElementById('hasDefenseEdu').checked,
        isActive: true
    };

    const method = id ? 'PUT' : 'POST';
    const url = id ? `${API_URL}/${id}` : API_URL;

    try {
        await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        resetForm();
        fetchStudents();
    } catch (error) {
        console.error("Lỗi khi lưu dữ liệu:", error);
    }
});

// Chỉnh sửa sinh viên
async function editStudent(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        const item = await response.json();
        
        document.getElementById('studentId').value = item.id;
        document.getElementById('name').value = item.name || '';
        document.getElementById('studentCode').value = item.studentCode || '';
        document.getElementById('dateOfBirth').value = item.dateOfBirth || '';
        document.getElementById('gender').value = item.gender || '';
        document.getElementById('idCardNumber').value = item.idCardNumber || '';
        document.getElementById('idCardIssuePlace').value = item.idCardIssuePlace || '';
        document.getElementById('address').value = item.address || '';
        document.getElementById('status').value = item.status || 'Đang học';
        document.getElementById('recordStatus').value = item.recordStatus || 'Hoạt động';
        document.getElementById('adminClass').value = item.adminClass || '';
        document.getElementById('major').value = item.major || '';
        document.getElementById('earnedCredits').value = item.earnedCredits || 0;
        document.getElementById('gpa').value = item.gpa || 0;
        document.getElementById('cohort').value = item.cohort || '';
        document.getElementById('hasPhysicalEdu').checked = item.hasPhysicalEdu || false;
        document.getElementById('hasDefenseEdu').checked = item.hasDefenseEdu || false;
        
        document.getElementById('submitBtn').textContent = 'Cập Nhật Sinh Viên';
        document.getElementById('cancelBtn').style.display = 'inline-block';
        window.scrollTo(0, 0);
    } catch (error) {
        console.error("Lỗi khi tải chi tiết sinh viên:", error);
    }
}

// Xóa sinh viên
async function deleteStudent(id) {
    if(confirm('Bạn có chắc muốn xóa sinh viên này?')) {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        fetchStudents(); 
    }
}

// Reset form
function resetForm() {
    document.getElementById('studentForm').reset();
    document.getElementById('studentId').value = '';
    document.getElementById('submitBtn').textContent = 'Lưu Sinh Viên';
    document.getElementById('cancelBtn').style.display = 'none';
}

document.getElementById('cancelBtn').addEventListener('click', resetForm);

// Khởi chạy khi trang load
document.addEventListener('DOMContentLoaded', fetchStudents);
