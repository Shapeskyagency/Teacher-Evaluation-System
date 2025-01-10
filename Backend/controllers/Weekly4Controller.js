const { createNotification } = require("../config/notify");
const ClassDetails = require("../models/ClassDetails");
const User = require("../models/User");
const Weekly4Form = require("../models/Weekly4Form");
const sendEmail = require("../utils/emailService");

// Create a new Weekly4Form
exports.createWeekly4Form = async (req, res) => {
  const userId = req?.user?.id;
  const teacherIds = req?.body?.teacherId;
  const { FormData, date, dateOfSubmission, isCompleted, isInitiated } = req.body;

  try {
    // Validate user existence
    const userData = await User.findById(userId);
    if (!userData) {
      return res.status(400).json({ success: false, error: "User not found" });
    }

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


    // Handle initiated forms with multiple teacher IDs
    if (isInitiated?.status) {
      const dataPush = await Promise.all(
        teacherIds.map(async (teacherId) => {
          const newForm = new Weekly4Form({ ...req.body, teacherId });
          const savedForm = await newForm.save();
          if (!savedForm) {
            throw new Error("Form not saved");
          }
          return savedForm;
        })
      );

      return res.status(201).json({ success: true, data: dataPush });
    }

    // Handle non-initiated single form
    const newForm = new Weekly4Form(Payload);
    const savedForm = await newForm.save();
    if (!savedForm) {
      return res.status(400).json({ success: false, error: "Form not saved" });
    }

    res.status(201).json({ success: true, data: savedForm });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Get all Weekly4Forms
exports.getAllWeekly4Forms = async (req, res) => {
  try {
    // Fetch all Weekly4Forms
    const forms = await Weekly4Form.find()
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
