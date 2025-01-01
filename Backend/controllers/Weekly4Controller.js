const { createNotification } = require("../config/notify");
const User = require("../models/User");
const Weekly4Form = require("../models/Weekly4Form");
const sendEmail = require("../utils/emailService");

// Create a new Weekly4Form
exports.createWeekly4Form = async (req, res) => {
    const userId = req?.user?.id; // Fetch user ID from the request
    try 
    {
        const UserData = User.findById(userId);
       
        if(!UserData){
            res.status(400).json({ success:false, error: "User not found" });
        }

const newForm = new Weekly4Form(req.body);
const savedForm = await newForm.save();

        const notification = await createNotification({
            title: `New Weekly 4 Form is initiated by ${UserData?.name}`,
            route: `weekly4form/create/${savedForm._id}`,
            reciverId: req.body.techerId,
          });

          res.status(201).json({success:true, savedForm});

    } catch (error) {
        res.status(400).json({success:false, error: error.message });
    }
};

// Get all Weekly4Forms
exports.getAllWeekly4Forms = async (req, res) => {
    try {
        // Fetch all Weekly4Forms
        const forms = await Weekly4Form.find()
        .populate('isInitiated.Observer','-password -coordinator -designation -email -updatedAt -__v')
        .populate('techerId','-password -coordinator -designation -email -updatedAt ');
        res.status(200).json(forms);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a single Weekly4Form by ID
exports.getWeekly4FormById = async (req, res) => {
    try {
        const form = await Weekly4Form.findById(req.params.id).populate('isInitiated.Observer');
        if (!form) {
            return res.status(404).json({ message: 'Form not found' });
        }
        res.status(200).json(form);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a Weekly4Form by ID
exports.updateWeekly4Form = async (req, res) => {
    try {
        const updatedForm = await Weekly4Form.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).populate('isInitiated.Observer','-password -coordinator -designation -email -updatedAt -__v');

        if (!updatedForm) {
            return res.status(404).json({ message: 'Form not found' });
        }

        res.status(200).json(updatedForm);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete a Weekly4Form by ID
exports.deleteWeekly4Form = async (req, res) => {
    try {
        const deletedForm = await Weekly4Form.findByIdAndDelete(req.params.id);

        if (!deletedForm) {
            return res.status(404).json({ message: 'Form not found' });
        }

        res.status(200).json({ message: 'Form deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
