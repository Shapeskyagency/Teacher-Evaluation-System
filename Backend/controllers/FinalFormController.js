// createFormFinal

const Observer_F4 = require("../models/Observer_F4");



// Create Observer_F4 API
const createFormFinal = async (req, res) => {
    const userId = req?.user?.id;
    try {
        const {
            Fortnightly_Monitor,
            Classroom_Walkthrough,
            Notebook_Checking,
            isObserverComplete,
            SartDate,
            createdBy,
        } = req.body;

        // Validate required fields
        if (!SartDate || !createdBy) {
            return res.status(400).json({ error: 'SartDate and createdBy are required.' });
        }

        // Create a new Observer_F4 document
        const newObserverF4 = new Observer_F4({
            Fortnightly_Monitor,
            Classroom_Walkthrough,
            Notebook_Checking,
            isObserverComplete,
            SartDate,
            createdBy:userId,
        });

        // Save to the database
        const savedObserverF4 = await newObserverF4.save();

        res.status(201).json({
            message: 'Observer_F4 created successfully',
            data: savedObserverF4,
        });
    } catch (error) {
        console.error('Error creating Observer_F4:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = { createFormFinal };
