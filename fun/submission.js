const Submission = require('../model/submission')
const TestCase=require('../collections/testCase');
const Problem =require('../model/problem');
const Pk1submission =require('../model/pk1submissionid');
const Pk2submission =require('../model/pk2submissionid');
const Pk3submission =require('../model/pk3submissionid');
const Sollution =require('../collections/Sollution');
const User =require('../model/user');
const func =require('./testcCppCode');
const SubmissionQueue = require('../model/SubmissionQueue');
const test = require('../collections/test');
const mongoose =require('mongoose');
const sequelize =require('../model/index');
const Contestinprogress =require('../model/contestinprogress');
// for practise problems
async function processSubmission() {
  let firstSubmissionData =await SubmissionQueue.findOne({});
  while(firstSubmissionData!=null && firstSubmissionData.dataValues!=null){
    await firstSubmissionData.destroy();
    const mongoSession = await mongoose.startSession();
    const sequelizeTransaction = await sequelize.transaction();
  
     mongoSession.startTransaction();
    
    try {
      const firstSubmission =firstSubmissionData.dataValues;
      // console.log("del");
      // console.log(del);
      const solution = firstSubmission.solution;
      const problemId = firstSubmission.problemId;
      const data=await Problem.findByPk(problemId,{ attributes: ['testCases','timeLimit','attempts']});
      const testCasesId =data.dataValues.testCases;
      let testCasesIdsArray =await test.findById(testCasesId);
      testCasesIdsArray=testCasesIdsArray.testCasesId;
      // console.log(testCasesIdsArray);
      console.log("delji");
    let i=1;
    let veridict ='Accepted';
    for(i=0;i<testCasesIdsArray.length;i++){
      const testData= await TestCase.findById(testCasesIdsArray[i]);
      // console.log(testData.input);
      // console.log(testData.output);
      veridict = func.testCppCode(solution,testData.input,testData.output,data.dataValues.timeLimit*1000); 
      if(veridict!=="Accepted"){
        veridict =veridict+` at ${i+1}`;
        break;
      }
    }
    console.log("veridict");

    const who =firstSubmission.who;
    const userdata =await User.findByPk(who,{attributes :['totalsubmissions','userId']});
    let z=0;
    let attepmtonproblembyuser=0;
    const structforpk3=problemId+`$`+`${userdata.dataValues.userId}`;
    while(z!=null){
      attepmtonproblembyuser+=1;
      z=await Pk3submission.findByPk(structforpk3+`$`+`${attepmtonproblembyuser}`);
    }
    const userAttemptOnProblemId=attepmtonproblembyuser;
    const when =firstSubmission.when;
    const newSollution =new Sollution({sollution:solution});
    const  savedSollution =await newSollution.save();
  console.log(savedSollution);
  let newSubmission;
     newSubmission = await Submission.create({
      when,
      who,
      problemId,
      veridict,
      Submissionid:String(savedSollution._id),
  });
  // console.log("newSubmission");
  const Submissionid=String(newSubmission.Submissionid);
  console.log(Submissionid);
  const userId=who;
  const pk1=problemId+`$`+`${data.dataValues.attempts+1}`;
  const Usertoupdate = await User.findByPk(userId);
  const Prbolemtoupdate = await Problem.findByPk(problemId);
  await Usertoupdate.increment('totalsubmissions');
  await Prbolemtoupdate.increment('attempts');
  const pk2=`${userdata.dataValues.userId}`+`$`+`${userdata.dataValues.totalsubmissions+1}`;
  console.log("i m here");
  const pk3=problemId+`$`+`${userdata.dataValues.userId}`+`$`+`${userAttemptOnProblemId}`;
  console.log("e");
  const newEntryInPk1 = await Pk1submission.create({
    pk1,
    Submissionid
  });
  console.log("newEntryInPk1");
  const newEntryInPk2 = await Pk2submission.create({
    Submissionid,
    pk2
  });
  console.log("newEntryInPk2");

  const newEntryInPk3 = await Pk3submission.create({
    Submissionid,
    pk3
  });
  // let userinContest =await Contestinprogress.findByPk(who);
  // if(userinContest==null){
  //  userinContest =await Contestinprogress.create({userId:who});
  // }
  // console.log(userinContest);
  await sequelizeTransaction.commit();
  await mongoSession.commitTransaction();
  console.log("newEntryInPk3");
    } catch (error) {
    await sequelizeTransaction.rollback();
    await mongoSession.abortTransaction();
    return "Internal server error";
    }finally{
      mongoSession.endSession();
    }

    firstSubmissionData =await SubmissionQueue.findOne({});
  }
  if(firstSubmissionData===null){
    console.log("the queue is empty");
    return "empty";
  }
  }
module.exports={
    processSubmission
};