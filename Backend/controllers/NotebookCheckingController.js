const Form3 = require('../models/Form3');
const notification = require('../models/notification');
const User = require('../models/User');
const sendEmail = require('../utils/emailService');

exports.createForm = async (req, res) => {
    const {
        NameofObserver,
        DateOfObservation,
        className,
        Section,
        Subject,
        ClassStrength,
        NotebooksSubmitted,
        Absentees,
        Defaulters,
        maintenanceOfNotebooks,
        qualityOfOppurtunities,
        qualityOfTeacherFeedback,
        qualityOfLearner
    } = req.body

    const userId = req?.user?.id;
    try{
        const user = await User.findById(userId, "-password -mobile -employeeId -customId");

        // Check if the user has access as "Observer" or "SuperAdmin"
        if (!user || (user.access !== "Teacher" && user.access !== "SuperAdmin")) {
            return res.status(403).json({ message: "You do not have permission to create this form." });
        }

        // Ensure that the NameoftheVisitingTeacher is provided
        if (!NameofObserver) {
            return res.status(400).json({ message: "Name of Observer is required." });
        }


        const newForm = new Form3({
            grenralDetails:
            {
                NameofObserver,
                DateOfObservation,
                className,
                Section,
                Subject,
            },
            NotebooksTeacher:{
                ClassStrength,
                NotebooksSubmitted,
                Absentees,
                Defaulters
            },
            createdBy:user?._id,
            isObserverComplete:false,
            ObserverForm:{},
            isTeacherComplete:true,
            TeacherForm:{
                maintenanceOfNotebooks,
                qualityOfOppurtunities,
                qualityOfTeacherFeedback,
                qualityOfLearner
            },
        });

        const savedForm = await newForm.save();

        // Send success response
        res.status(201).json({ message: "Form created successfully", form: savedForm,status: true });

    }catch(Error){
        console.log("Error",Error)
        res.status(500).send(Error)
    }
}



exports.getSignleForm = async (req, res) => {
    const FormID = req?.params?.id;
    try {
        const Form = await Form3.findById(FormID)
        .populate({
            path: 'createdBy',
            select: '-password -mobile -employeeId -customId'
        })
        .populate({
            path: 'grenralDetails.NameofObserver',
            select: '-password -mobile -employeeId -customId'
        });
        
        if(!FormID && !Form?._id){
            return res.status(403).json({ message: "You do not have permission." });
        }
        res.status(200).send(Form)

    } catch (error) {
        console.error("Error Getting NoteBook Checking:", error);
        res.status(500).json({ message: "Error Getting NoteBook Checking.", error });
    }
}



exports.updateObserverFields = async (req, res) => {
    const userId = req.user?.id; // Ensure `req.user` exists via middleware
    const formId = req.params?.id; // Get form ID from URL parameters
    const {
        ClassStrength,
        NotebooksSubmitted,
        Absentees,
        Defaulters,
        observerFeedback,
        isObserverComplete,
        maintenanceOfNotebooks,
        qualityOfOppurtunities,
        qualityOfTeacherFeedback,
        qualityOfLearner
    } = req.body;

    try {
        // Validate user permissions
        const user = await User.findById(userId).select('-password -mobile -employeeId -customId');
        if (!user || !['Observer', 'SuperAdmin'].includes(user.access)) {
            return res.status(403).json({ message: 'Unauthorized access to update the form.' });
        }

        // Build the payload dynamically to include only provided fields
        const payload = {
            NotebooksObserver: {
                ClassStrength,
                NotebooksSubmitted,
                Absentees,
                Defaulters,
            },
            isObserverComplete,
            ObserverForm:{
                maintenanceOfNotebooks,
                qualityOfOppurtunities,
                qualityOfTeacherFeedback,
                qualityOfLearner
            },
            observerFeedback,
        };

        // Remove undefined or null values from the payload
        Object.keys(payload).forEach(
            (key) => payload[key] === undefined && delete payload[key]
        );

        // Update the form directly
        const form = await Form3.findByIdAndUpdate(
            formId,
            { $set: payload },
            { new: true, runValidators: true } // Return the updated document
        );

        // If no form is found, return an error
        if (!form) {
            return res.status(404).json({ message: 'Form not found.' });
        }

        // Send the response with the updated form
        res.status(200).json({
            success: true,
            message: 'Observer fields updated successfully.',
            data: form,
        });
    } catch (error) {
        console.error('Error updating observer fields:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while updating the form.',
            error: error.message,
        });
    }
};

