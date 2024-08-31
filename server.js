const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const bodyParser = require('body-parser');
const TaskRoutes = require('./routes/tasks');
const User = require('./models/user');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false
}));

app.use('/api/tasks', TaskRoutes);

app.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = new User({ username, password });
        await user.save();
        res.status(201).json({ message: 'Usuario Registrado' });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (user && await user.comparePassword(password)) {
            req.session.userId = user._id;
            res.json({ message: 'Inicio de sesion exitosa' });
        } else {
            res.status(401).json({ message: 'Credenciales Invalidas' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

function ensureAuthenticated(req, res, next) {
    if (req.session.userId) {
        next();
    } else {
        res.status(401).json({ message: 'No Autorizado' });
    }
}

app.use('/api/tasks', ensureAuthenticated);

mongoose.connect('mongodb://localhost:27017/taskmanager', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
    })
    .catch(err => console.error('Database conexion erronea:', err));
