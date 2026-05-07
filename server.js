const express = require('express');
const cors = require('cors');
const sql = require('mssql');

const app = express();
app.use(cors());
app.use(express.json());

// Cấu hình kết nối SQL Server
const dbConfig = {
    user: 'sa', // Thay bằng user của bạn
    password: 'your_password', // Thay bằng password của bạn
    server: 'localhost', 
    database: 'your_database_name', // Thay bằng tên DB
    options: {
        encrypt: false, // Bật true nếu dùng Azure
        trustServerCertificate: true 
    }
};

// 1. CREATE - Thêm mới CVHT cho lớp
app.post('/api/advisors', async (req, res) => {
    try {
        const { employee_id, student_classe_id, start_date } = req.body;
        const pool = await sql.connect(dbConfig);
        const result = await pool.request()
            .input('employee_id', sql.UniqueIdentifier, employee_id)
            .input('student_classe_id', sql.UniqueIdentifier, student_classe_id)
            .input('start_date', sql.DateTime2, start_date)
            .query(`
                INSERT INTO advisor_classe_sections 
                (employee_id, student_classe_id, start_date, created_at, is_active)
                OUTPUT INSERTED.*
                VALUES (@employee_id, @student_classe_id, @start_date, GETDATE(), 1)
            `);
        res.status(201).json(result.recordset[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. READ - Lấy danh sách (Chỉ lấy record đang active)
app.get('/api/advisors', async (req, res) => {
    try {
        const pool = await sql.connect(dbConfig);
        const result = await pool.request().query(`
            SELECT * FROM advisor_classe_sections 
            WHERE is_active = 1 AND deleted_at IS NULL
            ORDER BY created_at DESC
        `);
        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. UPDATE - Cập nhật thông tin (VD: kết thúc nhiệm kỳ)
app.put('/api/advisors/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { end_date } = req.body; // Cập nhật ngày kết thúc
        const pool = await sql.connect(dbConfig);
        const result = await pool.request()
            .input('id', sql.UniqueIdentifier, id)
            .input('end_date', sql.DateTime2, end_date)
            .query(`
                UPDATE advisor_classe_sections 
                SET end_date = @end_date, updated_at = GETDATE()
                OUTPUT INSERTED.*
                WHERE id = @id
            `);
        res.json(result.recordset[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 4. DELETE - Soft Delete (Xóa mềm)
app.delete('/api/advisors/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const pool = await sql.connect(dbConfig);
        await pool.request()
            .input('id', sql.UniqueIdentifier, id)
            .query(`
                UPDATE advisor_classe_sections 
                SET is_active = 0, deleted_at = GETDATE()
                WHERE id = @id
            `);
        res.json({ message: 'Đã xóa mềm thành công!' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server đang chạy tại http://localhost:${PORT}`);
});