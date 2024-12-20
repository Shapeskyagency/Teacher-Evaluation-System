const { createNotification } = require('../config/notify');
const Form2 = require('../models/Form2');
const notification = require('../models/notification');
const User = require('../models/User');
const sendEmail = require('../utils/emailService');


exports.createForm = async (req, res) => {
    const {
        NameoftheVisitingTeacher,
        DateOfObservation,
        className,
        Section,
        Subject,
        Topic,
        LessonTakenBy,
        ratingScale,
        rangeOfGrade,
        essentialAggrements,
        planingAndPreparation,
        classRoomEnvironment,
        instruction,
        totalScores,
        scoreOutof,
        percentageScore,
        Grade,
        NumberofParametersNotApplicable,
        isObserverCompleted,
        ObserverFeedback,
    } = req.body;
    const userId = req?.user?.id;
    // const parsedValues = Object.entries(essentialAggrements).map(([key, value]) => JSON.parse(value));
    // console.log(parsedValues)
    try {
        // Fetch user details without sensitive fields
        const user = await User.findById(userId, "-password -mobile -employeeId -customId");

        // Check if the user has access as "Observer" or "SuperAdmin"
        if (!user || (user.access !== "Observer" && user.access !== "SuperAdmin")) {
            return res.status(403).json({ message: "You do not have permission to create this form." });
        }

        // Ensure that the NameoftheVisitingTeacher is provided
        if (!NameoftheVisitingTeacher) {
            return res.status(400).json({ message: "Name of the Visiting Teacher is required." });
        }

        // Create the new form data
        const newForm = new Form2({
            createdBy: userId,
            isObserverCompleted: ObserverFeedback ? true : false, // Default to `false` if not provided
            ObserverFeedback: ObserverFeedback || [], // Default to an empty array
            isTeacherCompletes:false,
            grenralDetails: {
                NameoftheVisitingTeacher,
                DateOfObservation: DateOfObservation || new Date(), // Use current date if not provided
                className,
                Section,
                Subject,
                Topic,
                LessonTakenBy: LessonTakenBy || "Not Specified" // Default value for LessonTakenBy
            },
            ratingScale,
            rangeOfGrade,
            essentialAggrements,
            planingAndPreparation,
            classRoomEnvironment,
            instruction,
            totalScores,
            scoreOutof,
            percentageScore,
            Grade,
            NumberofParametersNotApplicable,
        });
         // Save the form to the database
         const savedForm = await newForm.save();
        const notification = await createNotification({
            title: 'You are invited to fill the Classroom Walkthrough',
            route: `classroom-walkthrough/create/${savedForm._id}`,
            reciverId: NameoftheVisitingTeacher,
          });


        // Send success response
        res.status(201).json({ message: "Form created successfully", form: savedForm,status: true });
    } catch (error) {
        console.error("Error creating Classroom Walkthrough:", error);
        res.status(500).json({ message: "Error creating Classroom Walkthrough.", status: false,error });
    }
};



exports.getSignleForm = async (req, res) => {
    const FormID = req?.params?.id;
    try {
        const Form = await Form2.findById(FormID)
        .populate({
            path: 'createdBy',
            select: '-password -mobile -employeeId -customId'
        })
        .populate({
            path: 'grenralDetails.NameoftheVisitingTeacher',
            select: '-password -mobile -employeeId -customId'
        });

        if(!FormID && !Form?._id){
            return res.status(403).json({ message: "You do not have permission." });
        }
        res.status(200).send(Form)

    } catch (error) {
        console.error("Error Getting Classroom Walkthrough:", error);
        res.status(500).json({ message: "Error Getting Classroom Walkthrough.", error });
    }
}

exports.GetTeahearsForm = async (req, res) => {
    const FormID = req?.params?.id;
    try {
        const Form = await Form2.find(FormID)
        .populate({
            path: 'createdBy',
            select: '-password -mobile -employeeId -customId'
        })
        .populate({
            path: 'grenralDetails.NameoftheVisitingTeacher',
            select: '-password -mobile -employeeId -customId'
        });

        if(!FormID && !Form?._id){
            return res.status(403).json({ message: "You do not have permission." });
        }
        res.status(200).send(Form)

    } catch (error) {
        console.error("Error Getting Classroom Walkthrough:", error);
        res.status(500).json({ message: "Error Getting Classroom Walkthrough.", error });
    }
}


exports.GetcreatedBy = async (req, res) => {
    const userId = req?.user?.id;
    try {
        const Form = await Form2.find({createdBy:userId})
        .populate({
            path: 'createdBy',
            select: '-password -mobile -employeeId -customId'
        })
        .populate({
            path: 'grenralDetails.NameoftheVisitingTeacher',
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


exports.GetTeacherForm = async (req, res) => {
    const userId = req?.user?.id;
    try {
        const Form = await Form2.find({ "grenralDetails.NameoftheVisitingTeacher": userId })
        .populate({
            path: 'createdBy',
            select: '-password -mobile -employeeId -customId'
        })
        .populate({
            path: 'grenralDetails.NameoftheVisitingTeacher',
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





exports.TeacherContinueForm = async (req, res) => {
    const userId = req?.user?.id;
    const FormID = req?.params?.id;
    const { TeacherFeedback, isTeacherCompletes } = req.body;

    try {
        // Fetch user details without sensitive fields
        const user = await User.findById(userId, "-password -mobile -employeeId -customId");

        // Check if user has permission
        if (!user || (user.access !== "Teacher" && user.access !== "SuperAdmin")) {
            return res.status(403).json({ message: "You do not have permission to update this form." });
        }
        // Find the form
        const form = await Form2.findById(FormID);
            
        if (!form) {
            return res.status(404).json({ message: "Form not found." });
        }

        // Update the form fields
        form.TeacherFeedback = TeacherFeedback || form.TeacherFeedback;
        form.isTeacherCompletes = isTeacherCompletes ?? form.isTeacherCompletes;

        // Save the updated form
         await form.save();

        // Send the response
        res.status(200).json({ message: "Form Successfully Completed."});

    } catch (error) {
        console.error("Error in TeacherContinueForm:", error);
        res.status(500).json({ message: "An error occurred while updating the form.", error });
    }
};
