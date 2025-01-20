const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Server } = require('socket.io');
const http = require('http'); 

const app = express();
const PORT = 5001;

app.use(bodyParser.json());
app.use(express.json());
app.use(cors({
    origin: 'http://sakib-taskmanage.netlify.app', 
}));

const server = http.createServer(app); 
const io = new Server(server, {
    cors: {
        origin: 'http://sakib-taskmanage.netlify.app', 
        methods: ['GET', 'POST', 'PUT', 'DELETE']
    }
});

const db = mysql.createPool({
host: process.env.MYSQL_ADDON_HOST || 'bkaqrrbryuzdulodib7d-mysql.services.clever-cloud.com',
  user: process.env.ADDON_USER || 'uj7xc3uzdqcorlb9',
  password: process.env.ADDON_PASSWORD || "zoJI5607ajYIx6EV2fqu",
  database: process.env.ADDON_DB || 'bkaqrrbryuzdulodib7d',
  port: process.env.ADDON_POR || '3306',
  url :process.env.ADDON_URl
}).promise();

// Broadcast notifications
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('disconnect', () => {
        console.log('A user disconnected:', socket.id);
    });
});

app.get('/api/tasks', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM tasks');
        res.status(200).json(rows);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Something went wrong' });
    }
});

app.get('/api/tasks/:id', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM tasks WHERE id = ?', [req.params.id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.status(200).json(rows[0]);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Something went wrong' });
    }
});


// Emit events after CRUD operations
app.post('/api/tasks', async (req, res) => {
    try {
        const { task_name, status } = req.body;
        console.log(req.body);
        
        const [result] = await db.query('INSERT INTO tasks (task_name, status) VALUES (?, ?)', [task_name, status || 'pending']);
        const newTask = { id: result.insertId, task_name, status: status || 'pending' };
        io.emit('task_added', { message: 'Task added successfully!', task: newTask }); 
        res.status(201).json(newTask);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error adding task' });
    }
});

app.put('/api/tasks/:id', async (req, res) => {
    try {
        const { task_name, status } = req.body;
        const { id } = req.params;
        const [result] = await db.query('UPDATE tasks SET task_name = ?, status = ? WHERE id = ?', [task_name, status, id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Task not found or no changes made' });
        }
        io.emit('task_updated', { message: 'Task updated successfully!', id }); 
        res.status(200).json({ message: 'Task updated successfully!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error updating task' });
    }
});

app.delete('/api/tasks/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await db.query('DELETE FROM tasks WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Task not found' });
        }
        io.emit('task_deleted', { message: 'Task deleted successfully!', id });
        res.status(200).json({ message: 'Task deleted successfully!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error deleting task' });
    }
});

server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
