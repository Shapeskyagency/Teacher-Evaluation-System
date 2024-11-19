const notification = require('../models/notification');
const User = require('../models/User');  // Import the User model (for Coordinators, Teachers, and Observers)
const sendEmail = require('../utils/emailService');
const Form1 = require('../models/Form1');

exports.createForm = async (req, res) => {
  const { className, section, date, isCoordinator, coordinatorID, isTeacher, teacherID } = req.body;
  const userId = req?.user?.id;

  try {
    let recipientEmail = '';
    let reciverId = '';
    let formData;

    // Determine the recipient based on role
    if (isCoordinator && coordinatorID) {
      const coordinator = await User.findById({_id:coordinatorID});
      if (coordinator?.email) {
        recipientEmail = coordinator.email;
        reciverId = coordinator._id;
      }

      formData = new Form1({
        userId,
        className: className,
        section,
        date: new Date(date),
        isCoordinator,
        coordinatorID,
        isTeacher,
        observerForm: {}, // Defaults will apply
        teacherForm: {}, // Defaults will apply
      });

      
    } else if (isTeacher && teacherID) {
      const teacher = await User.findById({_id:teacherID});
      if (teacher?.email) {
        recipientEmail = teacher.email;
        reciverId = teacher._id;
      }

      formData = new Form1({
        userId,
        className: className,
        section,
        date: new Date(date),
        isCoordinator,
        isTeacher,
        teacherID,
        observerForm: {}, // Defaults will apply
        teacherForm: {}, // Defaults will apply
      });
    }

    // Save the form
    if (!formData) {
      return res.status(400).json({ message: 'Invalid data. Either coordinator or teacher details are required.' });
    }

    await formData.save();

    // Send email and notification if recipient exists
    if (recipientEmail) {
      const subject = 'New Fortnightly Monitor Form Created';
      const body = `
        A new Fortnightly Monitor Form has been created for:
        Class: ${className}, Section: ${section}.
        Click here to fill the form: https://abcd.com/form/${formData._id}
      `;
      // sendEmail(recipientEmail, subject, body);

      const notifications = new notification({
        title: 'You are invited to fill the Fortnightly Monitor Form',
        route: `fortnightly-monitor/create/${formData._id}`,
        reciverId,
        date: new Date(),
        status: 'unSeen',
      });
      await notifications.save();
    }

    res.status(201).json({ message: 'Fortnightly Monitor created successfully!', form: formData });
  } catch (error) {
    console.error('Error creating Fortnightly Monitor:', error);
    res.status(500).json({ message: 'Error creating Fortnightly Monitor.', error });
  }
};

exports.getuserForm = async(req,res)=>{
  const userId = req?.user?.id;
  try{
    const data = await Form1.find({userId}).populate('teacherID coordinatorID')
    res.status(200).send(data)
  }catch(err){
    res.status(400).send(err)
  }

}

exports.getSingleuserForm = async(req,res)=>{
  const formId = req?.params.id;
  try{
    const data = await Form1.findById(formId).populate('teacherID coordinatorID')
    res.status(200).send(data)
  }catch(err){
    res.status(400).send(err)
  }

}



exports.FormFill = async (req, res) => {
  const formId = req.params.id
  try {
    const { 
      isCoordinatorComplete, 
      isTeacherComplete, 
      observerForm, 
      teacherForm 
    } = req.body;

    // Check if the formId is provided
    if (!formId) {
      return res.status(400).json({
        message: 'Form ID is required'
      });
    }

    // Create an object to store the updates
    let updateData = {};

    if (isCoordinatorComplete) {
      updateData = { 
        isCoordinatorComplete, 
        observerForm
      };
    } else if (isTeacherComplete) {
      updateData = { 
        isTeacherComplete, 
        teacherForm
      };
    }

    // Update the form based on the formId
    const updatedForm = await Form1.findByIdAndUpdate(formId, updateData, { new: true });

    // If no form was found, return a 404 error
    if (!updatedForm) {
      return res.status(404).json({
        message: 'Form not found'
      });
    }

    // Send a success response with the updated form
    res.status(200).json({
      message: 'Form updated successfully!',
      form: updatedForm
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Error updating the form.',
      error: error.message
    });
  }
};




// 2. Get forms for Mother Teachers to fill
exports.getFormsForMotherTeacher = async (req, res) => {
  const { teacherID } = req.params;

  try {
    const forms = await Form1.find({ 'creationDetails.teacherID': teacherID, 'totalScore': 0 });

    if (forms.length === 0) {
      return res.status(404).json({ message: 'No forms found for this teacher.' });
    }

    res.status(200).json({ forms });
  } catch (error) {
    console.error('Error fetching Fortnightly Monitor Forms for teacher:', error);
    res.status(500).json({ message: 'Error fetching Fortnightly Monitor Forms.', error });
  }
};

// 3. Get forms for Observers to fill
exports.getFormsForObserver = async (req, res) => {
  const { observerID } = req.params;

  try {
    const forms = await Form1.find({ 'creationDetails.coordinatorID': observerID, 'totalScore': 0 });

    if (forms.length === 0) {
      return res.status(404).json({ message: 'No Fortnightly Monitor Forms pending for this observer.' });
    }

    res.status(200).json({ forms });
  } catch (error) {
    console.error('Error fetching Fortnightly Monitor Forms for observer:', error);
    res.status(500).json({ message: 'Error fetching Fortnightly Monitor Forms.', error });
  }
};

// 4. Fill and Submit Form (by Teacher or Observer)
exports.fillForm = async (req, res) => {
  const { formID, responses, observerID,TeacherId } = req.body;

  try {
    const form = await Form1.findById(formID);

    if (!form) {
      return res.status(404).json({ message: 'Fortnightly Monitor Forms not found.' });
    }

    // Update form responses
    form.classCleanliness = responses.classCleanliness || form.classCleanliness;
    form.newsUpdate = responses.newsUpdate || form.newsUpdate;
    form.smileyChart = responses.smileyChart || form.smileyChart;
    form.missionEnglishChart = responses.missionEnglishChart || form.missionEnglishChart;
    form.transportCorner = responses.transportCorner || form.transportCorner;
    form.generalDiscipline = responses.generalDiscipline || form.generalDiscipline;
    form.lunchEtiquettes = responses.lunchEtiquettes || form.lunchEtiquettes;
    form.birthdayChart = responses.birthdayChart || form.birthdayChart;
    form.unitSyllabusChart = responses.unitSyllabusChart || form.unitSyllabusChart;
    form.uniformTieBeltShoesIDCard = responses.uniformTieBeltShoesIDCard || form.uniformTieBeltShoesIDCard;
    form.classPass = responses.classPass || form.classPass;
    form.classTeacherTimeTable = responses.classTeacherTimeTable || form.classTeacherTimeTable;
    form.participationChart = responses.participationChart || form.participationChart;
    form.coScholasticActivityChart = responses.coScholasticActivityChart || form.coScholasticActivityChart;
    form.goodwillPiggyBank = responses.goodwillPiggyBank || form.goodwillPiggyBank;
    form.thursdaySpecial = responses.thursdaySpecial || form.thursdaySpecial;
    form.homeworkRegister = responses.homeworkRegister || form.homeworkRegister;
    form.groupOnDuty = responses.groupOnDuty || form.groupOnDuty;
    form.weeklyRotationOfStudent = responses.weeklyRotationOfStudent || form.weeklyRotationOfStudent;
    form.anecdotalRegister = responses.anecdotalRegister || form.anecdotalRegister;
    form.supplementaryReadingRecord = responses.supplementaryReadingRecord || form.supplementaryReadingRecord;
    form.thinkZone = responses.thinkZone || form.thinkZone;
    form.digitalCitizenshipRules = responses.digitalCitizenshipRules || form.digitalCitizenshipRules;
    form.meditation = responses.meditation || form.meditation;

    // Calculate the total score (assuming each question has equal weight)
    form.totalScore = Object.values(responses).reduce((total, value) => total + (value === 'Yes' ? 1 : value === 'No' ? 0 : 0.5), 0);
    form.selfEvaluationScore = responses.selfEvaluationScore || form.selfEvaluationScore;

    // If Observer is filling the form, mark it as completed
    if (observerID) {
      form.observerCompleted = true;
    }else if (TeacherId) {
      form.TeacherCompleted = true;
    }

    await form.save();
    res.status(200).json({ message: 'Fortnightly Monitor Forms submitted successfully!', form });

    // Send notification email to Observer after submission (optional)
    const observer = await User.findById(observerID);
    const Teacher = await User.findById(TeacherId);
    if (observer && observer.email) {
      sendEmail(observer.email, form.creationDetails);
    }else if (Teacher && Teacher.email) {
      sendEmail(Teacher.email, "Thanks you for completing the form" ,form.creationDetails);
    }

  } catch (error) {
    console.error('Error filling Fortnightly Monitor Forms:', error);
    res.status(500).json({ message: 'Error submitting Fortnightly Monitor Forms.', error });
  }
};

// 5. Get Forms to Display on Observer's Dashboard
exports.getObserverDashboard = async (req, res) => {
  const { observerID } = req.params;

  try {
    const forms = await Form1.find({ 'observerCompleted': false, 'creationDetails.isCoordinator': true });

    if (forms.length === 0) {
      return res.status(404).json({ message: 'No Fortnightly Monitor Forms available for filling.' });
    }

    res.status(200).json({ forms });
  } catch (error) {
    console.error('Error fetching dashboard data for observer:', error);
    res.status(500).json({ message: 'Error fetching dashboard data.', error });
  }
};
