const User = require('../models/User');  // Import the User model (for Coordinators, Teachers, and Observers)
const sendEmail = require('../utils/emailService');
const Form1 = require('../models/Form1');
const Notification = require('../models/notification');
const ClassDetails = require('../models/ClassDetails');

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

     const classData =  await ClassDetails.findOne({_id:className});
     if(!classData){
      res.status(400).json({success: false, message:" Class and Section is Required!"})
     }

      formData = new Form1({
        userId,
        className: classData.className,
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
//       const subject = 'New Fortnightly Monitor Form Created';
//       const body = `
// Dear {Teacher Name},
// The Fortnightly Monitor form has been initiated by {Observer Name} on {Date}. Kindly review and complete your section at your earliest convenience.
// Regards,
// The Admin Team
//   `;
//       await sendEmail(recipientEmail, subject, body);

      const notifications = new Notification({
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



exports.FormInitiation = async (req, res) => {
  const { isTeacher, teacherIDs } = req.body;
  const userId = req?.user?.id;
  const userIdName = req?.user?.name;
  let FormData;
  try {
    if (isTeacher && Array.isArray(teacherIDs) && teacherIDs.length > 0) {
      const teacherForms = await Promise.all(
        teacherIDs.map(async (item) => {
          const teacher = await User.findById({ _id: item });
          if (teacher?.email) {
            const formData = new Form1({
              userId,
              isTeacher,
              isObserverInitiation:true,
              observerForm: {},
              teacherForm: {},
              teacherID:teacher?._id,
              date:new Date()
            });

            // Save the form
           FormData =  await formData.save();
          

            const notification = new Notification({
              title: 'You are invited to fill the Fortnightly Monitor Form',
              route: `fortnightly-monitor/create/${formData._id}`,
              reciverId: teacher._id,
              date: new Date(),
              status: 'unSeen',
            });
            await notification.save();

            return formData;
          }
          return null;
        })
      );
      const checkForm = await Form1.findById(FormData._id).populate('teacherID coordinatorID userId');
      const validForms = teacherForms.filter((form) => form !== null);
      const recipientEmail = checkForm?.teacherID?.email;
      const recipientName = checkForm?.teacherID?.name;
      const subject = 'Fortnightly Monitor Form Initiated';
      const body = `
Dear ${recipientName},
The Fortnightly Monitor form has been initiated by ${checkForm?.coordinatorID?.name || checkForm?.userId?.name } on ${new Date()}. Kindly review and complete your section at your earliest convenience.
Regards,
The Admin Team
  `;
  
      await sendEmail(recipientEmail, subject, body);

      if (validForms.length > 0) {
        return res.status(201).json({
          message: 'Fortnightly Monitor created successfully!',
          forms: validForms,
        });
      }
    }

    return res.status(400).json({
      message: 'Invalid data. Either coordinator or teacher details are required.',
    });
  } catch (error) {
    console.error('Error creating Fortnightly Monitor:', error);
    res.status(500).json({ message: 'Error creating Fortnightly Monitor.', error });
  }
};


exports.getuserForm = async (req, res) => {
  const userId = req?.user?.id;
  try {
    // Fetch both sets of data
    const data = await Form1.find({ userId });
    const Form = await Form1.find({ teacherID: userId }).populate('teacherID coordinatorID');

    // Combine both arrays without duplicates based on _id
    const combinedArray = [
      ...data,
      ...Form.filter(
        (formItem) => !data.some((dataItem) => dataItem._id.toString() === formItem._id.toString())
      ),
    ];

    res.status(200).send({ CombinedForm: combinedArray});
  } catch (err) {
    res.status(400).send(err);
  }
};


exports.GetObseverForm1 = async (req, res) => {
    const userId = req?.user?.id;
    try {
        const Form = await Form1.find({ coordinatorID: userId })
        .populate({
          path: 'teacherID',
          select: '-password -mobile -employeeId -customId'
      })
      .populate({
          path: 'userId',
          select: '-password -mobile -employeeId -customId'
      })
      .populate({
        path: 'coordinatorID',
        select: '-password -mobile -employeeId -customId'
    })
        const FormInitiation = await Form1.find({ isObserverInitiation: true })
        .populate({
            path: 'teacherID',
            select: '-password -mobile -employeeId -customId'
        })
        .populate({
            path: 'userId',
            select: '-password -mobile -employeeId -customId'
        })
        .populate({
          path: 'coordinatorID',
          select: '-password -mobile -employeeId -customId'
      })
        if(!userId && !userId?.id){
            return res.status(403).json({ message: "You do not have permission." });
        }

        res.status(200).send({Form:Form,Initiate:FormInitiation})

    } catch (error) {
        console.error("Error Getting Classroom Walkthrough:", error);
        res.status(500).json({ message: "Error Getting Classroom Walkthrough.", error });
    }
}


exports.getSingleuserForm = async(req,res)=>{
  const formId = req?.params.id;
  try{
    const data = await Form1.findById(formId)
    .populate('teacherID', '-password') // Exclude password field
  .populate('coordinatorID', '-password') // Exclude password field
  .populate('userId', '-password'); // Exclude password field
    res.status(200).send(data)
  }catch(err){
    res.status(400).send(err)
  }

}



exports.FormFill = async (req, res) => {
  const formId = req.params.id
  try {
    const data = await Form1.findById(formId);
    const { 
      isCoordinatorComplete, 
      isTeacherComplete, 
      observerForm, 
      teacherForm,
      className,
      date,
      Section
    } = req.body;

    const FindClass = await ClassDetails.findById(className);

    
    if (data?.isObserverInitiation && (!className || !date || !Section)) {
      res.status(400).json({
        message: 'All fields are required',
      });
    }

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
        ObserverSubmissionDate:new Date(),
        observerForm
      };
    } else if (isTeacherComplete) {
      updateData = { 
        isTeacherComplete, 
        TeacherSubmissionDate:new Date(),
        teacherForm,
        className: FindClass?.className || className,
        date:data?.date || date,
        section:data?.section || Section
      };
    }

    // Update the form based on the formId
    const updatedForm = await Form1.findByIdAndUpdate(formId, updateData, { new: true }).populate('teacherID coordinatorID userId');

    // If no form was found, return a 404 error
    if (!updatedForm) {
      return res.status(404).json({
        message: 'Form not found'
      });
    }
    const recipientEmail = updatedForm?.userId?.email || updatedForm?.userId?.email;
    const recipientName = updatedForm?.userId?.name || updatedForm?.userId?.name;

    if(isCoordinatorComplete){
    const subject = 'Observer Submission Completed for Fortnightly Monitor';
    const body = ` 
                  Dear ${updatedForm?.teacherID?.name},
                  ${recipientName} has submitted their section of the Fortnightly Monitor form on ${new Date()}. You may review the Report now.
                  Regards,
                  The Admin Team
                    `;

    await sendEmail(recipientEmail, subject, body);
    }

        if(isTeacherComplete){
          const notifications = new Notification({
            title: `${updatedForm?.teacherID?.name} Have Complete the form now its your turn!`,
            route: `fortnightly-monitor/create/${updatedForm?._id}`,
            reciverId:updatedForm?.userId?._id,
            date: new Date(),
            status: 'unSeen',
          });

          const subject = 'Self-Assessment Submission Received for Fortnightly Monitor';
          const body = ` 
                        Dear ${recipientName},
                        ${updatedForm?.teacherID?.name} has submitted their Self-Assessment of the Fortnightly Monitor form on ${new Date()}. Please review and fill your section.
                        Regards,
                        The Admin Team
                          `;
      
          await sendEmail(recipientEmail, subject, body);
          await notifications.save();
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





// 5. Get Forms to Display on Observer's Dashboard
exports.getObserverDashboard = async (req, res) => {
  const { observerID,TeacherID } = req.body;
  try {
    let forms
    if(observerID){
       forms = await Form1.find({ isCoordinatorComplete : false, coordinatorID:observerID })
       .populate('teacherID', '-password') // Exclude password field
  .populate('coordinatorID', '-password') // Exclude password field
  .populate('userId', '-password'); // Exclude password field
    }else if(TeacherID){
      forms = await Form1.find({ isTeacherComplete : false, teacherID:TeacherID })
      .populate('teacherID', '-password') // Exclude password field
  .populate('coordinatorID', '-password') // Exclude password field
  .populate('userId', '-password'); // Exclude password field
    }

    if (forms?.length === 0) {
      return res.status(404).json({ message: 'No Fortnightly Monitor Forms available for filling.' });
    }

    res.status(200).json({ forms });
  } catch (error) {
    console.error('Error fetching dashboard data for observer:', error);
    res.status(500).json({ message: 'Error fetching dashboard data.', error });
  }
};



exports.GetFormOneAdmin = async (req, res) => {
  const userId = req?.user?.id;

  try {
      const GetAllForms = await Form1.find()
      .populate({
          path: 'teacherID',
          select: '-password -mobile -employeeId -customId'
      })
      .populate({
          path: 'userId',
          select: '-password -mobile -employeeId -customId'
      })
      .populate({
        path: 'coordinatorID',
        select: '-password -mobile -employeeId -customId'
    })
      if(!userId && !userId?.id){
          return res.status(403).json({ message: "You do not have permission." });
      }

      res.status(200).send(GetAllForms)

  } catch (error) {
      console.error("Error Getting Form One:", error);
      res.status(500).json({ message: "Error Getting Form One.", error });
  }
}