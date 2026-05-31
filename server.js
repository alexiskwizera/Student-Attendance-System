const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db');

const app = express();
app.use(bodyParser.json());

// Root route
app.get('/', (req, res) => {
    res.send('Student Attendance System is running');
});

// STUDENT ROUTES
app.post('/students', (req, res) => {
    const { name, reg_number, class: studentClass } = req.body;
    const sql = "INSERT INTO students (name, reg_number, class) VALUES (?, ?, ?)";
    db.query(sql, [name, reg_number, studentClass], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Student added successfully!", studentId: result.insertId });
    });
});

app.get('/students', (req, res) => {
    db.query("SELECT * FROM students", (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

app.put('/students/:id', (req, res) => {
    const { name, reg_number, class: studentClass } = req.body;
    const sql = "UPDATE students SET name=?, reg_number=?, class=? WHERE id=?";
    db.query(sql, [name, reg_number, studentClass, req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Student updated successfully!" });
    });
});

app.delete('/students/:id', (req, res) => {
    db.query("DELETE FROM students WHERE id=?", [req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Student deleted successfully!" });
    });
});

// ATTENDANCE ROUTES
app.post('/attendance', (req, res) => {
    const { student_id, date, status } = req.body;
    const sql = "INSERT INTO attendance (student_id, date, status) VALUES (?, ?, ?)";
    db.query(sql, [student_id, date, status], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Attendance recorded successfully!" });
    });
});

app.get('/attendance', (req, res) => {
    const sql = `SELECT attendance.id, students.name, attendance.date, attendance.status
                 FROM attendance
                 JOIN students ON attendance.student_id = students.id`;
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});