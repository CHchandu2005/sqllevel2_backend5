const user = require('../model/User');
const questions = require('./questions.json');

const sendquestions = (req, res) => {
  const filteredQuestions = questions.map(({ question_no, question }) => ({
    question_no,
    question
  }));

  res.status(200).json({ questions: filteredQuestions });
};


const submitquestions = async (req, res) => {

  console.log("In submit questions:",req.body);
  const { userID, questions, time } = req.body;
  try {
    const existingUser = await user.findOne({ teckziteid: userID });

    if (existingUser) {
      // Update the questions array and end timestamp
      existingUser.questions = questions;
      existingUser.completedtime = time;
      await existingUser.save();

      res.status(200).json({ message: 'Questions updated successfully' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
}

module.exports = { sendquestions, submitquestions };
