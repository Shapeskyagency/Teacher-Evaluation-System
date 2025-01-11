const { createNotification } = require("../config/notify");
const ClassDetails = require("../models/ClassDetails");
const User = require("../models/User");
const Weekly4Form = require("../models/Weekly4Form");
const sendEmail = require("../utils/emailService");

// Create a new Weekly4Form
exports.createWeekly4Form = async (req, res) => {
  const { id: userId } = req?.user || {};
  const { teacherId: teacherIds = [], FormData, date, dateOfSubmission, isCompleted, isInitiated } = req.body;

  try {
    // Step 1: Validate user existence
    const userData = await User.findById(userId);
    if (!userData) {
      return res.status(400).json({ success: false, error: "User not found" });
    }

    const Payload2 = {
      date,
      isInitiated
    };
      // Step 5: Handle form creation based on isInitiated
      if (isInitiated?.status) {
        return handleInitiatedForms(teacherIds, Payload2, res);
      }
    // Step 2: Fetch class names for each classId in FormData
    const classNamesMap = await getClassNamesForFormData(FormData);
    // Step 3: Replace classId with className in FormData
    FormData.forEach((formItem) => {
      if (formItem?.classId && Array.isArray(formItem?.classId)) {
        formItem.classId = formItem.classId.map(classId => classNamesMap[classId] || null);
      }
    });

    // Step 4: Prepare the payload
    const Payload = {
      FormData,
      date,
      dateOfSubmission,
      isCompleted,
      isInitiated,
      teacherId: userId
    };

    

    // Step 6: Create non-initiated form
    return createNonInitiatedForm(Payload, res);
  } catch (error) {
    return res.status(400).json({ success: false, error: error.message });
  }
};

// Helper function to get class names for FormData
const getClassNamesForFormData = async (FormData) => {
  const classNamesMap = {};

  // Ensure FormData exists and is an array
  if (!Array.isArray(FormData)) {
    return classNamesMap;
  }

  // Collect all classIds
  const classIds = FormData
    .filter(formItem => formItem?.sections && Array.isArray(formItem?.sections))
    .flatMap(formItem => formItem.sections.map(section => section.classId)); // Safely access classId

  const uniqueClassIds = [...new Set(classIds)];

  // Fetch class details in bulk (only once)
  const classDetails = await ClassDetails.find({ '_id': { $in: uniqueClassIds } }).lean();

  // Map classIds to classNames
  classDetails.forEach(classDetail => {
    classNamesMap[classDetail._id] = classDetail?.className;
  });


  // Replace classId with className in FormData
  FormData.forEach((formItem) => {
    if (formItem?.sections) {
      formItem.sections.forEach((section) => {
        const className = classNamesMap[section.classId];
        if (className) {
          section.className = className; // Replace classId with className
          delete section.classId; // Optionally, remove classId if no longer needed
        }
      });
    }
  });

  return FormData; // Return updated FormData with classNames
};

// Helper function to handle initiated forms (with multiple teacher IDs)
const handleInitiatedForms = async (teacherIds, Payload, res) => {
  try {
  
    const dataPush = await Promise.all(
      teacherIds.map(async (teacherId) => {
        Payload.teacherId=teacherId
        const newForm = new Weekly4Form(Payload);
        const savedForm = await newForm.save();
        if (!savedForm) throw new Error("Form not saved");
        return savedForm;
      })
    );
    return res.status(201).json({ success: true, data: dataPush });
  } catch (error) {
    return res.status(400).json({ success: false, error: error.message });
  }
};

// Helper function to handle non-initiated forms (single form)
const createNonInitiatedForm = async (Payload, res) => {
  try {
    const newForm = new Weekly4Form(Payload);
    const savedForm = await newForm.save();
    if (!savedForm) return res.status(400).json({ success: false, error: "Form not saved" });
    return res.status(201).json({ success: true, data: savedForm });
  } catch (error) {
    return res.status(400).json({ success: false, error: error.message });
  }
};


// Get all Weekly4Forms
exports.getAllWeekly4Forms = async (req, res) => {

 const userId = req.user.id 
  try {
    // Fetch all Weekly4Forms
    const forms = await Weekly4Form.find({
      $or: [
        { teacherId: userId },
        { 'isInitiated.Observer': userId }
      ]
    }).lean()
      .populate('isInitiated.Observer', '-password -coordinator -designation -email -updatedAt -__v')
      .populate('teacherId', '-password -coordinator -designation -email -updatedAt ');
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
      return res.status(404).json({ success: false, message: 'Form not found' });
    }
    res.status(200).json({ success: true, form });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Form not found', error: error.message });
  }
};

// Update a Weekly4Form by ID
exports.updateWeekly4Form = async (req, res) => {
  const { FormData, date, dateOfSubmission, isCompleted, isInitiated } = req.body;
  try {

    // Fetch class names for each classId in FormData
    const ClassArry = await Promise.all(
      FormData?.map(async (formItem) => {
        if (formItem?.classId && Array.isArray(formItem.classId)) {
          const classNames = await Promise.all(
            formItem.classId.map(async (classId) => {
              const classDetails = await ClassDetails.findById(classId);
              return classDetails?.className || null;
            })
          );
          return classNames; // Return the array of class names for this form item
        }
        return null;
      })
    );

    // Replace classId with className in FormData
    FormData?.forEach((formItem, index) => {
      if (formItem.classId && Array.isArray(formItem.classId)) {
        formItem.classId = ClassArry[index] || []; // Replace classId with the corresponding class names
      }
    });

    const Payload = {
      FormData,
      date,
      dateOfSubmission,
      isCompleted,
      isInitiated
    }

    const updatedForm = await Weekly4Form.findByIdAndUpdate(
      req.params.id,
      Payload,
      { new: true, runValidators: true }
    ).populate('isInitiated.Observer', '-password -coordinator -designation -email -updatedAt -__v');

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
