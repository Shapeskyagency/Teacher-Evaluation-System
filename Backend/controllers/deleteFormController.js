const Form1 = require("../models/Form1");
const Form2 = require("../models/Form2");
const Form3 = require("../models/Form3");
const Weekly4Form = require("../models/Weekly4Form");
const WingCoordinator = require("../models/WingCoordinator");

// Common delete function
const deleteDocumentByModel = async (Model, id, formName, res) => {
  try {
    const deleted = await Model.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: `${formName} not found` });
    }
    return res.status(200).json({
      success: true,
      message: `${formName} deleted successfully`,
      data: deleted
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: `Error deleting ${formName}`,
      error: err.message
    });
  }
};

// Delete APIs
const deleteForm1 = (req, res) => {
    deleteDocumentByModel(Form1, req.params.id, 'Form2', res);
  };

const deleteForm2 = (req, res) => {
  deleteDocumentByModel(Form2, req.params.id, 'Form2', res);
};

const deleteForm3 = (req, res) => {
  deleteDocumentByModel(Form3, req.params.id, 'Form3', res);
};

const deleteForm4 = (req, res) => {
  deleteDocumentByModel(Weekly4Form, req.params.id, 'Form4', res);
};

const deleteWingCoordinator = (req, res) => {
  deleteDocumentByModel(WingCoordinator, req.params.id, 'WingCoordinator', res);
};

module.exports = {
  deleteForm1,
  deleteForm2,
  deleteForm3,
  deleteForm4,
  deleteWingCoordinator
};
