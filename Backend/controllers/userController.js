const User = require('../models/User');
const sendEmail = require('../utils/emailService');

const generateCustomerId = () => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';

    const randomLetters1 = Array.from({ length : 3 }, () => letters.charAt(Math.floor(Math.random() * letters.length))).join('');
    const randomDigits = Array.from({ length: 3 }, () => numbers.charAt(Math.floor(Math.random() * numbers.length))).join('');
    const randomLetters2 = Array.from({ length: 4 }, () => letters.charAt(Math.floor(Math.random() * letters.length))).join('');

    return randomLetters1 + randomDigits + randomLetters2;
};

const createUser = async (req, res) => {
    try {
         if (req.user.access !== 'Superadmin') {
            return res.status(403).json({ message: 'Access denied. Only Superadmin can create new users.' });
        }
        const { employeeId, name, email, mobile, access, designation, coordinator, hod, motherTeacher, subjectTeacher, sclass, section, password } = req.body;

        const customId = generateCustomerId();
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'User already exists' });

        const newUser = new User({ employeeId, customId, name, email, mobile, access, designation, coordinator, hod, motherTeacher, subjectTeacher, sclass, section, password });
        await newUser.save();

        await sendEmail(
            email,
            'Your Account Details',
            `Dear ${name},\n\nYour account has been successfully created.\nYour password is: ${password}\n\nThank you.`
        )
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
       
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({
            // access: { $in: ["Teacher", "Observer"]}
        }, '-password');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

module.exports = {createUser, getAllUsers};
