const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'change_me';

const toUserDTO = (user) => ({
    id: user.id,
    email: user.email,
    fullName: user.full_name,
    role: user.role,
    createdAt: user.created_at,
    updatedAt: user.updated_at,
});

function validateRegisterInput(email, password, fullName) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

    if (!fullName || fullName.trim().length < 2) {
        return 'Full name must be at least 2 characters long';
    }

    if (!emailRegex.test(email)) {
        return 'Please enter a valid email address';
    }

    if (!passwordRegex.test(password)) {
        return 'Password must be at least 8 characters and include letters and numbers';
    }

    return null;
}

exports.register = async (req, res, next) => {
    try {
        const { email, password, fullName } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                error: 'Email and password are required'
            });
        }

        const validationError = validateRegisterInput(email, password, fullName);
        if (validationError) {
            return res.status(400).json({ error: validationError });
        }

        const existing = await User.findByEmail(email);
        if (existing) {
            return res.status(400).json({
                error: 'Email already registered'
            });
        }

        const user = await User.createUser(email, password, fullName);
        const token = jwt.sign({id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

        res.status(201).json({ token, user: toUserDTO(user) });
    } catch (err){
        next(err);
    }
};

exports.login = async(req, res, next) => { 
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                error: 'Email and password are required'
            });
        }
    
    const user = await User.findByEmail(email);
    if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }

    const ok = await User.verifyPassword(password, user.password_hash);
    if (!ok) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: toUserDTO(user) });
    } catch(err){
    next(err);
}
};
