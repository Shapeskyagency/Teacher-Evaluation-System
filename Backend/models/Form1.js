const mongoose = require('mongoose');
const { Schema } = mongoose;

// Schema for observer and teacher forms
const formSchema = new Schema({
  classCleanliness: { type: String, enum: ['Yes', 'No', 'N/A'], default: 'N/A' },
  newsUpdate: { type: String, enum: ['Yes', 'No', 'N/A'], default: 'N/A' },
  smileyChart: { type: String, enum: ['Yes', 'No', 'N/A'], default: 'N/A' },
  missionEnglishChart: { type: String, enum: ['Yes', 'No', 'N/A'], default: 'N/A' },
  transportCorner: { type: String, enum: ['Yes', 'No', 'N/A'], default: 'N/A' },
  generalDiscipline: { type: String, enum: ['Yes', 'No', 'N/A'], default: 'N/A' },
  lunchEtiquettes: { type: String, enum: ['Yes', 'No', 'N/A'], default: 'N/A' },
  birthdayChart: { type: String, enum: ['Yes', 'No', 'N/A'], default: 'N/A' },
  unitSyllabusChart: { type: String, enum: ['Yes', 'No', 'N/A'], default: 'N/A' },
  uniformTieBeltShoesICard: { type: String, enum: ['Yes', 'No', 'N/A'], default: 'N/A' },
  classPass: { type: String, enum: ['Yes', 'No', 'N/A'], default: 'N/A' },
  classTeacherTimeTable: { type: String, enum: ['Yes', 'No', 'N/A'], default: 'N/A' },
  participationChart: { type: String, enum: ['Yes', 'No', 'N/A'], default: 'N/A' },
  coScholasticActivityChart: { type: String, enum: ['Yes', 'No', 'N/A'], default: 'N/A' },
  goodwillPiggyBank: { type: String, enum: ['Yes', 'No', 'N/A'], default: 'N/A' },
  thursdaySpecial: { type: String, enum: ['Yes', 'No', 'N/A'], default: 'N/A' },
  homeworkRegisterAQADRegister: { type: String, enum: ['Yes', 'No', 'N/A'], default: 'N/A' },
  isGroupOnDuty: { type: String, enum: ['Yes', 'No', 'N/A'], default: 'N/A' },
  isWeeklyRotationOfStudents: { type: String, enum: ['Yes', 'No', 'N/A'], default: 'N/A' },
  anecdotalRegister: { type: String, enum: ['Yes', 'No', 'N/A'], default: 'N/A' },
  supplementaryReadingRecord: { type: String, enum: ['Yes', 'No', 'N/A'], default: 'N/A' },
  thinkZone: { type: String, enum: ['Yes', 'No', 'N/A'], default: 'N/A' },
  digitalCitizenshipRules: { type: String, enum: ['Yes', 'No', 'N/A'], default: 'N/A' },
  meditation: { type: String, enum: ['Yes', 'No', 'N/A'], default: 'N/A' },
  totalScore: { type: Number, min: 0, max: 100 },
  selfEvaluationScore: { type: Number, min: 0, max: 10 },
}, { timestamps: true });

// Main schema for the creation details
const creationDetailsSchema = new Schema({
  className: { type: String, required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  section: { type: String, required: true },
  date: { type: Date, required: true },
  isCoordinator: { type: Boolean, required: true },
  isCoordinatorComplete: { type: Boolean, default: false },
  coordinatorID: { type: Schema.Types.ObjectId, ref: 'User' },
  isTeacher: { type: Boolean, required: true },
  isTeacherComplete: { type: Boolean, default: false },
  teacherID: { type: Schema.Types.ObjectId, ref: 'User' },
  observerForm: { type: formSchema }, // Observer's form
  teacherForm: { type: formSchema }, // Teacher's form
}, { timestamps: true });

const Form1 = mongoose.model('Form1', creationDetailsSchema);
module.exports = Form1;