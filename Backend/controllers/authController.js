const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendEmail = require('../utils/emailService');
const Form1 = require('../models/Form1');
const Form2 = require('../models/Form2');
const Form3 = require('../models/Form3');
const Weekly4Form = require('../models/Weekly4Form');

const register = async (req, res) => {
    try {
        const { employeeId, customerId, name, email, mobile, access, designation, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'User already exists' });

        const newUser = new User({ employeeId, customerId, name, email, mobile, access, designation, password });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res?.json({ message: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res?.json({ message: 'Invalid credentials' });

        // const token = jwt.sign({ id: user._id, access: user.access,name:user.name }, process.env.JWT_SECRET, { expiresIn: '1h' });
        const token = jwt.sign(
            { id: user._id, access: user.access, name: user.name },
            process.env.JWT_SECRET
        );
        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};



// Request Password Reset
const requestPasswordReset = async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    const resetUrl = `http://your-frontend-url.com/reset-password/${resetToken}`;
    const message = `Please use the following link to reset your password: ${resetUrl}`;
    
    try {
     const data =   await sendEmail(user.email, 'Password Reset Request', message);
        res.json({ message: 'Password reset email sent' });
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();
        res.status(500).json({ message: 'Email could not be sent' });
    }
};

// Reset Password
const resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;
    const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
        return res.status(400).json({ message: 'Invalid or expired token' });
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: 'Password has been reset successfully' });
};

const changePassword = async (req, res) => {
    const { id } = req.user;
    const { currentPassword, newPassword } = req.body;

    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Current password is incorrect' });
        }

        user.password = newPassword;
        await user.save();

        res.status(200).json({ message: 'Password changed successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const FromCount = async (req, res) => {
    try {
        // Use await to ensure proper execution of asynchronous queries
        // Use $or to check if any of the specified fields are false
        const formTotalOneCount = await Form1.countDocuments({});
        const formTotalTwoCount = await Form2.countDocuments({});
        const formTotalThreeCount = await Form3.countDocuments({});
        const formTotalFourCount = await Weekly4Form.countDocuments({});
        const formOneCount = await Form1.countDocuments({
            $or: [{ isTeacherComplete: false }, { isCoordinatorComplete: false }]
        });

        const formTwoCount = await Form2.countDocuments({
            $or: [{ isTeacherCompletes: false }, { isObserverCompleted: false }]
        });

        const formThreeCount = await Form3.countDocuments({
            $or: [{ isTeacherComplete: false }, { isObserverComplete: false }]
        });
        const formFourCount = await Weekly4Form.countDocuments({isCompleted: false});

        const payload = [
            {
                fromName: "Fortnightly Monitor",
                count: formTotalOneCount,
                pending: formOneCount,
                color: "#E6F7FF",
                route: "/fortnightly-monitor",
            },
            {
                fromName: "Classroom Walkthrough",
                count: formTotalTwoCount,
                pending: formTwoCount,
                color: "#FFF7E6",
                route: "/classroom-walkthrough",
            },
            {
                fromName: "Notebook Checking",
                count: formTotalThreeCount,
                pending: formThreeCount,
                color: "#F0F5FF",
                route: "/notebook-checking-proforma",
            },
            {
                fromName: "Weekly Learning Checklist",
                count: formFourCount,
                pending: formTotalFourCount,
                color: "#F9F0FF",
                route: "/weekly4form",
            },
        ];

        // Send the payload as a JSON response
        res.status(200).json(payload);

    } catch (error) {
        console.error("Error fetching form counts:", error);
        res.status(500).json({ message: "Server error" });
    }
};


const getFillterForms = async (req, res) => {
    try {
        const userId = req.user.id;
        const { range, className } = req.body;

        if (!range || range.length !== 2 || !className) {
            return res.status(400).json({ message: "Invalid request parameters" });
        }

        const [fromDate, toDate] = range;
        

        // Convert to Date objects
        const from = new Date(fromDate);
        const to = new Date(toDate);
        to.setHours(23, 59, 59, 999); // Ensure we include the entire 'to' day
        
        // Fetch filtered forms
        const form1 = await Form1.find({
            className: className,
            createdAt: { $gte: from, $lte: to },
            isTeacherComplete:true,
            isCoordinator:true,
            $or: [{ coordinatorID: userId }, { userId: userId }]
        }).populate("userId teacherID","-password -mobile -employeeId")

        const form2 = await Form2.find({
            "grenralDetails.className": className,  // Ensure "grenralDetails" is the correct field name
            createdAt: { $gte: from, $lte: to },
            createdBy: userId,
            isTeacherCompletes:true,
            isObserverCompleted:true,
        }).populate("grenralDetails.NameoftheVisitingTeacher createdBy","-password -mobile -employeeId")

        const form3 = await Form3.find({
            "grenralDetails.className": className, 
            createdAt: { $gte: from, $lte: to },
            isTeacherComplete:true,
            isObserverComplete:true,
            isReflation:true,
            $or: [{ 'grenralDetails.NameofObserver': userId },{ createdBy: userId }]
        }).populate("teacherID createdBy","-password -mobile -employeeId")

        const form4 = await Weekly4Form.find({
            createdAt: { $gte: from, $lte: to },
            // $or: [{ coordinatorID: userId }, { userID: userId }]
        });

        res.json({
             form1,
             form2,
            form3,
            // form4
        });

    } catch (error) {
        console.error("Error fetching filtered forms:", error);
        res.status(500).json({ message: "Server error" });
    }
};
module.exports = { register, login,requestPasswordReset, resetPassword, changePassword,FromCount,getFillterForms}; 
