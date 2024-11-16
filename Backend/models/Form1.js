const mongoose = require('mongoose');
const { Schema } = mongoose;

// CreationDetails Schema for the creator of the form
const creationDetailsSchema = new Schema({
  class: { type: String, required: true },          // Class (e.g., 10th)
  section: { type: String, required: true },        // Section (e.g., A, B)
  date: { type: Date, required: true },             // Date when the form is created
  isCoordinator: { type: Boolean, required: true }, // Whether the creator is a coordinator
  coordinatorID: { type: Schema.Types.ObjectId, ref: 'User' }, // Coordinator's ID (from User model)
  isTeacher: { type: Boolean, required: true },     // Whether the creator is a teacher
  teacherID: { type: Schema.Types.ObjectId, ref: 'User' }, // Teacher's ID (from User model)
}, { timestamps: true });

// Main Form Schema
const formSchema = new Schema({
  creationDetails: creationDetailsSchema, // Includes creator's details
  classCleanliness: { type: String, enum: ['Yes', 'No', 'N/A'], default: 'N/A' },
  newsUpdate: { type: String, enum: ['Yes', 'No', 'N/A'], default: 'N/A' },
  smileyChart: { type: String, enum: ['Yes', 'No', 'N/A'], default: 'N/A' }, // Rating on a scale of 1 to 5
  missionEnglishChart: { type: String, enum: ['Yes', 'No', 'N/A'], default: 'N/A' }, // Rating on a scale of 1 to 5
  transportCorner: { type: String, enum: ['Yes', 'No', 'N/A'], default: 'N/A' },
  generalDiscipline: { type: String, enum: ['Yes', 'No', 'N/A'], default: 'N/A' },
  lunchEtiquettes: { type: String, enum: ['Yes', 'No', 'N/A'], default: 'N/A' },
  birthdayChart: { type: String, enum: ['Yes', 'No', 'N/A'], default: 'N/A' },
  unitSyllabusChart: { type: String, enum: ['Yes', 'No', 'N/A'], default: 'N/A' },
  uniformTieBeltShoesICard: { type: String, enum: ['Yes', 'No', 'N/A'], default: 'N/A' },
  classPass: { type: String, enum: ['Yes', 'No', 'N/A'], default: 'N/A' },
  classTeacherTimeTable: { type: String, enum: ['Yes', 'No', 'N/A'], default: 'N/A' },
  participationChart: { type: String, enum: ['Yes', 'No', 'N/A'], default: 'N/A' },
  coScholasticActivityChart: { type: String, enum: ['PA', 'PE', 'CA', 'N/A'], default: 'N/A' },
  goodwillPiggyBank: { type: String, enum: ['Yes', 'No', 'N/A'], default: 'N/A' },
  thursdaySpecial: { type: String, enum: ['Yes', 'No', 'N/A'], default: 'N/A' },
  homeworkRegisterAQADRegister: { type: String, enum: ['Yes', 'No', 'N/A'], default: 'N/A' },
  isGroupOnDuty: { type: Boolean, default: false },
  isWeeklyRotationOfStudents: { type: Boolean, default: false },
  anecdotalRegister: { type: String, enum: ['Yes', 'No', 'N/A'], default: 'N/A' },
  supplementaryReadingRecord: { type: String, enum: ['Yes', 'No', 'N/A'], default: 'N/A' },
  thinkZone: { type: String, enum: ['Yes', 'No', 'N/A'], default: 'N/A' },
  digitalCitizenshipRules: { type: String, enum: ['Yes', 'No', 'N/A'], default: 'N/A' },
  meditation: { type: String, enum: ['Yes', 'No', 'N/A'], default: 'N/A' },
  totalScore: { type: Number, min: 0, max: 100 },
  selfEvaluationScore: { type: Number, min: 0, max: 10 }, // Teacher's self-evaluation score (1-10)
  observerCompleted:{type: Boolean, default: false },
  TeacherCompleted:{type: Boolean, default: false },
}, { timestamps: true });

const Form1 = mongoose.model('Form1', formSchema);
module.exports = Form1;
