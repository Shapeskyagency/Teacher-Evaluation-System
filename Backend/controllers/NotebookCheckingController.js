const { createNotification } = require('../config/notify');
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

        const notification = await createNotification({
            title: 'You are invited to fill the Nootbook Checking',
            route: `notebook-checking-proforma/create/${savedForm._id}`,
            reciverId: NameofObserver,
          });
          
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
            isObserverComplete: true,
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


exports.GetcreatedByID = async (req, res) => {
    const userId = req?.user?.id;
    try {
        const Form = await Form3.find({createdBy:userId})
        .populate({
            path: 'createdBy',
            select: '-password -mobile -employeeId -customId'
        })
        .populate({
            path: 'grenralDetails.NameofObserver',
            select: '-password -mobile -employeeId -customId'
        });

        if(!userId && !userId?.id){
            return res.status(403).json({ message: "You do not have permission." });
        }

        res.status(200).send(Form)

    } catch (error) {
        console.error("Error Getting NoteBook:", error);
        res.status(500).json({ message: "Error Getting NoteBook.", error });
    }
}


exports.GetObseverForm = async (req, res) => {
    const userId = req?.user?.id;
    try {
        const Form = await Form3.find({ "grenralDetails.NameofObserver": userId })
        .populate({
            path: 'createdBy',
            select: '-password -mobile -employeeId -customId'
        })
        .populate({
            path: 'grenralDetails.NameofObserver',
            select: '-password -mobile -employeeId -customId'
        });

        if(!userId && !userId?.id){
            return res.status(403).json({ message: "You do not have permission." });
        }

        res.status(200).send(Form)

    } catch (error) {
        console.error("Error Getting Classroom Walkthrough:", error);
        res.status(500).json({ message: "Error Getting Classroom Walkthrough.", error });
    }
}

const updatePayload = (existingForm, userId, changes) => {
    const rolePrefix = userId === "Observer" ? "NotebooksObserver" : "NotebooksTeacher";
    const rolePrefix2 = userId === "Observer" ? "ObserverForm" : "TeacherForm";

    const fieldMappings = {
        [`${rolePrefix}.ClassStrength`]: changes.ClassStrength,
        [`${rolePrefix}.NotebooksSubmitted`]: changes.NotebooksSubmitted,
        [`${rolePrefix}.Absentees`]: changes.Absentees,
        [`${rolePrefix}.Defaulters`]: changes.Defaulters,
        [`observerFeedback`]: changes.observerFeedback,
        [`${rolePrefix2}`]: changes.isObserverComplete,
        [`${rolePrefix2}.maintenanceOfNotebooks`]: changes.maintenanceOfNotebooks,
        [`${rolePrefix2}.qualityOfOppurtunities`]: changes.qualityOfOppurtunities,
        [`${rolePrefix2}.qualityOfTeacherFeedback`]: changes.qualityOfTeacherFeedback,
        [`${rolePrefix2}.qualityOfLearner`]: changes.qualityOfLearner,
    };

    const payload = {};

    for (const [key, currentValue] of Object.entries(fieldMappings)) {
        if (currentValue !== undefined) {
            const existingValue = key.split('.').reduce((acc, part) => acc?.[part], existingForm);
            const hasChanged = typeof currentValue === "object" 
                ? JSON.stringify(currentValue) !== JSON.stringify(existingValue) 
                : currentValue !== existingValue;

            if (hasChanged) {
                payload[key] = currentValue;
            }
        }
    }

    return payload;
};

exports.EditUpdateNotebook = async (req, res) => {
    const formId = req.params.id;
    const userId = req?.user?.access;

    if (!formId) {
        return res.status(400).json({ message: "Form ID is required" });
    }

    try {
        const changes = {
            ClassStrength: req.body.ClassStrength,
            NotebooksSubmitted: req.body.NotebooksSubmitted,
            Absentees: req.body.Absentees,
            Defaulters: req.body.Defaulters,
            observerFeedback: req.body.observerFeedback,
            isObserverComplete: req.body.isObserverComplete,
            maintenanceOfNotebooks: req.body.maintenanceOfNotebooks,
            qualityOfOppurtunities: req.body.qualityOfOppurtunities,
            qualityOfTeacherFeedback: req.body.qualityOfTeacherFeedback,
            qualityOfLearner: req.body.qualityOfLearner,
        };

        const existingForm = await Form3.findById(formId);

        if (!existingForm) {
            return res.status(404).json({ message: "Form not found", success: false });
        }

        const payload = updatePayload(existingForm, userId, changes);

        const updatedForm = await Form3.findByIdAndUpdate(formId, { $set: payload }, { new: true });

        res.status(200).json({
            message: "Form updated successfully!",
            success: true,
            updatedForm,
        });
    } catch (error) {
        console.error("Error updating form:", error);
        res.status(500).json({
            message: "Error updating the form.",
            error: error.message,
        });
    }
};
