const mongoose = require('mongoose');
const { GiTeacher } = require('react-icons/gi');
const { Schema } = mongoose;


const BasicDetails = new Schema({
    NameofObserver:{ type: Schema.Types.ObjectId, ref: 'User'},
    DateOfObservation :{type:Date},
    className:{type:String},
    Section:{type:String},
    Subject:{type:String},
});

const NoteBookSction = new Schema({
    ClassStrength:{type:String},
    NotebooksSubmitted:{type:String},
    Absentees:{type:String},
    Defaulters:{type:String}
})

const questionForm =new Schema({
    maintenanceOfNotebooks:{type:Array},
    qualityOfOppurtunities:{type:Array},
    qualityOfTeacherFeedback:{type:Array},
    qualityOfLearner:{type:Array},
})


const NotebookCheckingProforma = new Schema({
    grenralDetails:BasicDetails,
    NotebooksTeacher:NoteBookSction,
    NotebooksObserver:NoteBookSction,
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required:true },
    isObserverComplete: {type:Boolean, default:false},
    ObserverForm:questionForm,
    isTeacherComplete:{type:Boolean, default:false},
    TeacherForm:questionForm,
    observerFeedback:{type:String}
})
const Form3 = mongoose.model('Form3',  NotebookCheckingProforma);
module.exports = Form3;