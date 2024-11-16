// const Form = require('../models/Form');  // Import the Form model
const Form1 = require('../models/Form1');
const notification = require('../models/notification');
const User = require('../models/User');  // Import the User model (for Coordinators, Teachers, and Observers)
const sendEmail = require('../utils/emailService');

// 1. Create a new Fortnightly-monitor by Teacher or Coordinator
exports.createForm = async (req, res) => {
  const { className, section, date, isCoordinator, coordinatorID, isTeacher, teacherID } = req.body;

  const newForm = new Form1({
    creationDetails: {
      class: className,
      section: section,
      date: new Date(date),
      isCoordinator: isCoordinator,
      coordinatorID: coordinatorID,
      isTeacher: isTeacher,
      teacherID: teacherID,
    },
    // Default responses
    classCleanliness: 'N/A',
    newsUpdate: 'N/A',
    smileyChart: 'N/A', // Default smiley chart value, can be modified later
    missionEnglishChart: 'N/A',
    transportCorner: 'N/A',
    generalDiscipline: 'N/A',
    lunchEtiquettes: 'N/A',
    birthdayChart: 'N/A',
    unitSyllabusChart: 'N/A',
    uniformTieBeltShoesIDCard: 'N/A',
    classPass: 'N/A',
    classTeacherTimeTable: 'N/A',
    participationChart: 'N/A',
    coScholasticActivityChart: 'N/A',
    goodwillPiggyBank: 'N/A',
    thursdaySpecial: 'N/A',
    homeworkRegister: 'N/A',
    groupOnDuty: 'N/A',
    weeklyRotationOfStudent: 'N/A',
    anecdotalRegister: 'N/A',
    supplementaryReadingRecord: 'N/A',
    thinkZone: 'N/A',
    digitalCitizenshipRules: 'N/A',
    meditation: 'N/A',
    totalScore: 0, // Can be calculated later based on responses
    selfEvaluationScore: 0, // Self-evaluation score from teacher or observer
  });

  try {
    await newForm.save();

    // Send email to either the coordinator or the teacher based on the flags
    let recipientEmail = '';
    let recipientId = '';
    if (isCoordinator && coordinatorID) {
      const coordinator = await User.findById(coordinatorID);
      if (coordinator && coordinator.email) {
        recipientEmail = coordinator.email;
        recipientId = coordinator._id
      }
    } else if (isTeacher && teacherID) {
      const teacher = await User.findById(teacherID);
      if (teacher && teacher.email) {
        recipientEmail = teacher.email;
        recipientId = teacher._id;
      }
    }

    if (recipientEmail) {
      const subject = 'New Fortnightly Monitor Form Created';
      const body = `A new Fortnightly Monitor Form has been created for Class: ${className}, Section: ${section}.
      Start Fill The From By Click on https://abcd.com/form/jksfljfdkljfjsl
      `;

      // Send email to the recipient (coordinator or teacher)
      sendEmail(recipientEmail, subject, body);
    }
    
    const SenderDeatils= new notification({
      title: `Invite you for filling Fortnightly Monitor Form`,
      route: `https://abcd.com/form/${newForm._id}`,
      reciverId:recipientId,
      date:new Date(),
      status:"unSeen"
    })
    await SenderDeatils.save()

    res.status(201).json({ message: 'Fortnightly Monitor created successfully!', form: newForm });
  } catch (error) {
    console.error('Error creating Fortnightly Monitor:', error);
    res.status(500).json({ message: 'Error creating Fortnightly Monitor.', error });
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
