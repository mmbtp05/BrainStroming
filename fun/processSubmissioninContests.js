const Submission = require('../model/submission')
const TestCase=require('../collections/testCase');
const Problem =require('../model/problem');
const Pk1submission =require('../model/pk1submissionid');
const Pk2submission =require('../model/pk2submissionid');
const Pk3submission =require('../model/pk3submissionid');
const Sollution =require('../collections/Sollution');
const User =require('../model/user');
const func =require('./testcCppCode');
const SubmissionQueueincontest = require('../model/SubmissionQueueincontest');
const test = require('../collections/test');
const mongoose =require('mongoose');
const sequelize =require('../model/index');
const Contestinprogress = require('../model/contestinprogress');
const { INTEGER } = require('sequelize');
// for practise problems
async function processSubmissioninContests(contestid) {
  let firstSubmissionData =await SubmissionQueueincontest.findOne({});
  while(firstSubmissionData!=null&&firstSubmissionData.dataValues!=null){
    const del=await firstSubmissionData.destroy();
    const mongoSession = await mongoose.startSession();
    const sequelizeTransaction = await sequelize.transaction();
    // if(isHigherPriority){
    //   return "Higher Priority task will run";
    // }
     mongoSession.startTransaction();
    if(firstSubmissionData===null){
      console.log("the queue is empty");
      return "empty";
    }
    try {
      const firstSubmission =firstSubmissionData.dataValues;
      // console.log("del");
      // console.log(del);
      // console.log("del");
    
      const solution = firstSubmission.solution;
      const problemId = contestid+`~`+firstSubmission.problemnum;
      const data=await Problem.findByPk(problemId,{ attributes: ['testCases','timeLimit','attempts']});
    // console.log("habibi");
      const testCasesId =data.dataValues.testCases;
      let testCasesIdsArray =await test.findById(testCasesId);
      testCasesIdsArray=testCasesIdsArray.testCasesId;
      // console.log(testCasesIdsArray);
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
    // console.log("veridict");

    const who =firstSubmission.who;
    const userdata =await User.findByPk(who,{attributes :['totalsubmissions','userId','rating','totalcontests']});
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
  // console.log("i m here");
  const pk3=problemId+`$`+`${userdata.dataValues.userId}`+`$`+`${userAttemptOnProblemId}`;
  // console.log("e");
  const newEntryInPk1 = await Pk1submission.create({
    pk1,
    Submissionid
  });

  // console.log("newEntryInPk1");
  const newEntryInPk2 = await Pk2submission.create({
    Submissionid,
    pk2
  });
  // console.log("newEntryInPk2");
  const newEntryInPk3 = await Pk3submission.create({
    Submissionid,
    pk3
  });
  let userinContest =await Contestinprogress.findByPk(who);
  console.log(userinContest);
  if(userinContest==null||userinContest.dataValues==null){
   userinContest =await Contestinprogress.create({userId:who,rating:userdata.dataValues.rating});
   console.log(userinContest);
  }
  let userincontestnewData =userinContest.dataValues;
  console.log("i am boue");
  let scoretobeadded= firstSubmission.score;
  if(veridict!='Accepted'){
    scoretobeadded=-50;
  }
  // console.log(userincontestnewData);
  userincontestnewData.score+=scoretobeadded;
  console.log(userincontestnewData.score);
  if(firstSubmission.problemnum==1){
    userincontestnewData.A+=1;
  }else if(firstSubmission.problemnum==2){
    userincontestnewData.B+=1;
  }else if(firstSubmission.problemnum==3){
    userincontestnewData.C+=1;
  }else if(firstSubmission.problemnum==4){
    userincontestnewData.D+=1;
  }
  if(userincontestnewData){
    console.log("kuch to hua tha");
    const updatedUser = await Contestinprogress.update({
      score:  userincontestnewData.score,
      A:userincontestnewData.A,
      B:userincontestnewData.B,
      C:userincontestnewData.C,
      D:userincontestnewData.D,
    },{where:{userId:who}});
}
  await sequelizeTransaction.commit();
  await mongoSession.commitTransaction();
  // console.log("newEntryInPk3");
    } catch (error) {
    await sequelizeTransaction.rollback();
    await mongoSession.abortTransaction();
    return "Internal server error";
    }finally{
      mongoSession.endSession();
    }
    firstSubmissionData =await SubmissionQueueincontest.findOne({});
  }
  }
module.exports={
  processSubmissioninContests
};