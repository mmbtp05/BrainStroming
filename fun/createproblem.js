const unpublishedProblem = require('../model/unpublishedProblems');
const testCase =require('../collections/testCase');
const test =require('../collections/test');
const func =require('./testcCppCode');
const mongoose = require('mongoose');
const sequelize =require('../model/index');
async function createProblem(req, res) {
 const mongoSession = await mongoose.startSession();
 const sequelizeTransaction = await sequelize.transaction();
  mongoSession.startTransaction();
try {
    const problemName = req.body.problemName;
    // const problemid = req.body.problemid;
    const problemStatement = req.body.problemStatement;
    const problemInput = req.body.problemInput;
    const problemOutput = req.body.problemOutput;
    const problemNote = req.body.problemNote;
    const timeLimit = req.body.timeLimit;
    const memoryLimit = req.body.memoryLimit;
    // const testCases = req.body.testCases;
    const solution = req.body.sollution;
    const difficulty = req.body.difficulty;
    const tags = req.body.tags;
    const veridict = func.testCppCode(solution,req.body.sampleInput,req.body.sampleOutput);
    console.log(veridict);
    if(veridict!='Accepted'){
      return res.json({message:"wrong input output for sollution"});
    }
    const firstTestCase =new testCase({
      input: req.body.sampleInput,
      output: req.body.sampleOutput
    });
    const firstSavedTestCase = await firstTestCase.save();
    const newtest = new test({
      testCasesId: [firstSavedTestCase._id]});

    const testArray = await newtest.save();
    const newProblem = await unpublishedProblem.create({
      problemName,
      // problemid,
      problemStatement,
      problemInput,
      problemOutput,
      problemNote,
      timeLimit,
      memoryLimit,
      testCases:String(testArray._id),
      sampleInput:req.body.sampleInput,
      sampleOutput:req.body.sampleOutput,
      difficulty,
      solution,
      tags,
      problemNote :req.body.Note
  });
  await sequelizeTransaction.commit();
  await mongoSession.commitTransaction();
  console.log("newProblem");
    return res.status(201).json(newProblem);
  } catch (error) {
    console.error(error);
    await sequelizeTransaction.rollback();

    await mongoSession.abortTransaction();
    return res.status(500).json({ error: 'Internal server error' });
  }finally{
    mongoSession.endSession();
  }
}
module.exports={
    createProblem
}