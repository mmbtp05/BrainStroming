const express = require('express')
const app = express()
require('./collections/index');
const jwt = require('jsonwebtoken');
var bodyParser = require('body-parser')
const cors = require('cors');
const secretKey = 'your_secret_key';
const Sequelize =require('sequelize');
const Submission=require('./model/submission')
const TestCase=require('./collections/testCase');
const Test=require('./collections/test');
const Problem =require('./model/problem');
const UnpublishedProblem =require('./model/unpublishedProblems');
const Pk1submission =require('./model/pk1submissionid');
const Pk2submission =require('./model/pk2submissionid');
const Pk3submission =require('./model/pk3submissionid');
const User =require('./model/user');
const SubmissionQueueincontest=require('./model/SubmissionQueueincontest');
// const Admin =require('./model/Admin');
const Contests =require('./model/contest');
const Contestsdata =require('./model/Contestsdata');
const  ContestsOfUser=require('./model/contestsOfUser');
const Contestinprogress =require('./model/contestinprogress');
const emergency =require('./model/standingstemp');
const SubmissionQueue =require('./model/SubmissionQueue');
const mongoose =require('mongoose');
// const PublishedProblem=require('./model/publishedProblem');
const commonstandings =require('./model/commonstandings');
const options = { timeZone: 'Asia/Kolkata' };
// External functions defined in other files so that code looks good
const funcSubmit=require('./fun/submission');
const funcSubmitincontest=require('./fun/processSubmissioninContests');
const funcCreateUser =require('./fun/createuser');
const funcCreateProblem =require('./fun/createproblem');
const createProblem=funcCreateProblem.createProblem;
const createUser=funcCreateUser.createUser;
const processSubmission=funcSubmit.processSubmission;
const processSubmissioninContests=funcSubmitincontest.processSubmissioninContests;
const func =require('./fun/testcCppCode');
const executeQueries =require('./fun/./rankcontestnats');
const startrating =require('./fun/startgivingratings');
const unpublishedProblem = require('./model/unpublishedProblems');
const contestApplicants = require('./model/contestapplicants');
// This function is used to verify token
const Standingstemp =require('./model/standingstemp');
function verifyToken(req, res, next) {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ message: 'Token is missing' });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Token is invalid' });
    }

    req.user = decoded;
    next();
  });
}

// This is to integrate with backend
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

/*
  all these below sync functions are used to create a table if it does not exist
  and all are kept in bracket just to short the code from side arrow 
*/

// This block of code below is to create models in sql database as we are using Sequelizer 

{Submission.sync();
SubmissionQueue.sync();
Problem.sync();
// TestCase.sync();
SubmissionQueueincontest.sync();
Pk1submission.sync();
Pk2submission.sync();
Pk3submission.sync();
User.sync();
Contests.sync();
ContestsOfUser.sync();
Contestinprogress.sync();
Contestsdata.sync();
emergency.sync();
// PublishedProblem.sync();
contestApplicants.sync();
UnpublishedProblem.sync();
Standingstemp.sync();
commonstandings.sync();
}

// This variable is to start and stop submission queue
let isHigherPriority= false;
/*
 this is just for demo 
*/
app.get('/', function (req, res) {
  res.send('Hello World')
});

// /*
// This api is used to signup 
// */



//This api is ready 
app.post('/signup', async (req, res) => {
  try {
    const userId = req.body.userId;
    const emailid = req.body.emailid;
    const password = req.body.password;
    // const role = req.body.role;
    const userWithSameUserId= await User.findByPk(userId);
    const userWithSameEmailId= await User.findOne({
      where: {
        emailid: emailid,
      },
    });
    if(userWithSameEmailId){
      return res.json({"error":"email id already in use"});
    }
    if(userWithSameUserId){
      return res.json({"error":"userid already in use"});
    }
    const newUser = await User.create({
      userId,
      emailid,
      password,
  });
  // console.log(newUser);
    return res.status(201).json(newUser);
  } catch (error) {
    // console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// /*
// This api is used to signin 
// */


//This api is ready 
app.post('/login',async (req, res) => {
  const  userId = req.body.userId;
  const  password = req.body.password;
  const  role = req.body.role;

  if (!userId || !password) {
    return res.status(401).json({ message: 'Username and password are required' });
  }
  const userDataValues = await User.findByPk(userId);
  console.log(password);
  if(userDataValues===null||userDataValues.dataValues===null){
    return res.send({"message":"There is no user with such userId"});
  }
  const userData =userDataValues.dataValues;
  console.log(userData.password);
  if(role!==userData.role){
    return res.send({"message":"your role is incorrext"});
  }
  if (userData.password === password) {
    const token = jwt.sign({ userId ,role}, secretKey, { expiresIn: '4h' });
    console.log(token);
    return res.json({ token,isAuthorised:true});
  }

  return res.status(401).json({ message: 'Invalid credentials' });
});

/*
This api is for sign out
*/


//This api is ready 
app.post('/logout', (req, res) => {
  const token = req.headers['authorization'];

  if (token) {
    tokenBlacklist.push(token);
    res.json({ message: 'Token has been revoked' });
  } else {
    res.status(400).json({ message: 'Token not provided' });
  }
});

// /*
// This api is used to submit the sollutions 
// # Only c++ sollutions are accepted
// */


function formatDateTime(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}-${day}-${month}T${hours}:${minutes}:${seconds}.000Z`;
}

//This api is ready an tested successfully
//Best Logical Api
let isrunning=false;
app.post('/submit',verifyToken, async (req, res) => {
  const contestId =req.body.contestId;
  const problemnum =req.body.problemnum;
  const problemId =contestId+`~`+problemnum;
  const when =new Date();
  const who =req.body.userId;
  const solution =req.body.solution;
  let contestdata=await Contestsdata.findByPk(contestId);
  contestdata=contestdata.dataValues;
  console.log(when);
  console.log(contestdata.endDate);
  console.log(contestdata.startDate);
  if(when>=contestdata.endDate){
  try{
    console.log('hm yaha hai');
  const pushinQueue =await SubmissionQueue.create({
    problemId:problemId,
    when,
    who,
    solution
  });
  // console.log(isHigherPriority);
  if(isHigherPriority==false&&isrunning==false){
    isrunning=true;
    processSubmission();
    isrunning=false;
  }
  return res.status(201).json({"message":"wait you submission is in queue"});
}catch(error){
  console.log(error);
  return res.status(501).json({"error":"please submit after some time"});
}
  }else if((when<=contestdata.endDate)&&(when>=contestdata.startDate)){
    console.log("when");
    console.log("contestdata.endDate");
    try{
      const registered =await contestApplicants.findByPk(contestId+`$`+who);
      // if(registered===null){
      //   return res.send("you are not registered");
      // }
      const pushincontestQueue =await SubmissionQueueincontest.create({
        problemnum,
        when,
        who,
        solution,
        score:req.body.score
      });
      console.log("pushincontestQueue");
        // processSubmission(false);
    if(isrunning==false){
    isrunning=true;
    console.log("i am running");
    processSubmissioninContests(contestId);
    isrunning=false;
    }
      return res.status(201).json({"message":"wait you submission is in queue"});
    }catch(error){
      console.log(error);
      return res.status(501).json({"error":"please submit after some time"});
    }
  }else{
    return res.send('aayein !!');
  }
return res.send("wait under testing");
});

/*
 admin or problem creators can submit there problems using this api 
 Later that admins can monitor these problems are they good or not
*/

//This api is ready an tested
app.post('/createproblem',verifyToken, async (req, res) => {
  if(req.user.role!='admin'){
    return res.json({"message":"you are not authorised"});
  }
  try{
    isHigherPriority=true;
    return createProblem(req,res);
  }catch(error){
    return  res.send(error);
  }
});


//This api is ready and tested
app.put('/updatequestion/:problemid',verifyToken,async (req,res) => {
  if(req.user.role!='admin'){
    return res.json({"message":"you are not authorised"});
  }
  try {
    const problemid = req.params.problemid;
    const problemName = req.body.problemName;
    const problemStatement = req.body.problemStatement;
    const problemInput = req.body.problemInput;
    const problemOutput = req.body.problemOutput;
    const problemNote = req.body.problemNote;
    const timeLimit = req.body.timeLimit;
    const memoryLimit = req.body.memoryLimit;
    const problemnum = req.body.problemnum;
    const contestid =req.body.contestid;
    const difficulty = req.body.difficulty;
    const tags = req.body.tags;
    const problemToUpdate =await UnpublishedProblem.findByPk(problemid);
    if(!problemToUpdate){
      return res.status(401).json({"message":"problem not found"});
    }
    const newProblem = await problemToUpdate.update({
      problemName,
      problemStatement,
      problemInput,
      problemOutput,
      problemNote,
      timeLimit,
      memoryLimit,
      difficulty,
      sampleInput,
      sampleOutput,
      problemnum,
      contestid,
      tags,
  });
  console.log(newProblem);
    return res.status(201).json(newProblem);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});


//This api is ready and tested
app.get('/unpublishedproblems/:page',verifyToken, async (req, res) => {
  if(req.user.role!='admin'){
    return res.json({"message":"you are not authorised"});
  }
  try {
    const pageSize=5;
    const page =req.params.page
    const allProblems = await UnpublishedProblem.findAll({
      attributes: ['problemName', 'contestid', 'problemnum','difficulty', 'tags','problemid'],
      order: [['problemid', 'DESC']], // Assuming createdAt is the timestamp column
      limit: pageSize,
      offset: (page - 1) * pageSize,
    });
  console.log("i was called");
    console.log(allProblems);
    return res.json({problems :allProblems});
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }

});

//This api is ready and tested
app.get('/unpublished/:problemid',verifyToken,async(req,res)=>{
  if(req.user.role!='admin'){
    return res.json({"message":"you are not authorised"});
  }
  try {
    console.log("i m here");
    const problemid =req.params.problemid;
    const problem = await UnpublishedProblem.findByPk(problemid);
    if(problem==null||problem.dataValues==null){
      return res.send("there is no problem like this")
    }
    console.log(problem)
    return res.json({problem:problem});
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});


//This api is ready and tested
app.post('/testCase/:problemId',verifyToken, async (req, res) => {
  if(req.user.role!='admin'){
    return res.json({"message":"you are not authorised"});
  }
  const mongoSession = await mongoose.startSession();
   mongoSession.startTransaction();
  try {
    isHigherPriority=true;
    const input = req.body.input;
    const output = req.body.output;
    const problemId = req.params.problemId;
    const data=await UnpublishedProblem.findByPk(problemId,{ attributes: ['testCases','solution','timeLimit']});
    const code =data.dataValues.solution;
  const result = func.testCppCode(code,input,output,data.dataValues.timeLimit*1000);
  if(result==="Accepted"){
  const newTestCase =new TestCase({
    input,
    output
  });
  const savedTestCase =await newTestCase.save();
  await Test.findByIdAndUpdate(
    data.dataValues.testCases,
      {$push: {testCasesId: savedTestCase._id }},
      {new :true}
  )
  await mongoSession.commitTransaction();
  console.log(newTestCase.dataValues);
}else{
    console.log(result);
  }
  mongoSession.com;
    return res.status(201).json({result});
  } catch (error) {
    console.error(error);
    await mongoSession.abortTransaction();
    return res.status(500).json({ error: 'Internal server error' });
  }finally{
    isHigherPriority=false;
      mongoSession.endSession();
  }
});

//above apis are tested
//This api is ready 
//This api is ready and tested
app.get('/submissions/:userId' ,async(req,res) =>{
  const userId=req.params.userId;
  console.log(userId);
  let totalsubmissions = await User.findByPk(userId,{attributes:['totalsubmissions']});
  totalsubmissions=totalsubmissions.dataValues.totalsubmissions;
  console.log(totalsubmissions);
  let userSubmissions =[];
  for(let i=totalsubmissions;i>0;i--){
    const result1 = await Pk2submission.findByPk(userId+`$`+`${i}`,{attributes :['Submissionid']});
    if(result1!=null){
    // const result2 = await Submission.findByPk(result1.Submissionid);
    userSubmissions.push(result1.dataValues);
    }
  }
  return res.send(userSubmissions);
});


//This api is ready and tested
app.get('/mysubmissions/problemset/:problemid',verifyToken,async(req,res) =>{
  const userid=req.user.userId;
  const problemid =req.params.problemid;
  console.log(userid);
  console.log(problemid);
  let userSubmissions =[];
  let i=1;
  while(true){
    const result1 = await Pk3submission.findByPk(problemid+`$`+ userid+`$`+`${i}`,{attributes :['Submissionid']});
    if(result1===null){
      break;
    }
    const result2 = await Submission.findByPk(result1.dataValues.Submissionid);
    i++;
    userSubmissions.push(result2.dataValues);
  }
  return res.send(userSubmissions);
});

//This api is ready and tested
app.get('/problemset/submissions/:problemid' ,async(req,res) =>{
  const problemid=req.params.problemid;
  console.log(problemid);
  let totalsubmissions = await Problem.findByPk(problemid,{attributes:['attempts']});
  totalsubmissions=totalsubmissions.dataValues.attempts;
  console.log(totalsubmissions);
  let userSubmissions =[];
  for(let i=totalsubmissions;i>0;i--){
    const result1 = await Pk1submission.findByPk(problemid+`$`+`${i}`,{attributes:['Submissionid']});
    if(result1){
    userSubmissions.push(result1.dataValues);
    }
  }
  return res.send(userSubmissions);
});

//This api is ready and tested
app.get('/problems/:page', async (req, res) => {
  console.log(req.user);
  const page =req.params.page
  try {
    const pageSize=2;
    const allProblems = await Problem.findAll({
      order: [['problemid', 'DESC']], 
      limit: pageSize,
      offset: (page - 1) * pageSize,
    });
    console.log(allProblems);
    return res.send(allProblems);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});


//------------------     below code is related to contest organization     ------------------\\


//tested Successfully

//This api is ready and tested
app.put('/selectproblemsforcontest/:contestid',verifyToken ,async (req, res) => {
  // selec
  if(req.user.role!="admin"){
    return res.send("you are not authorised");
  }
  try{
  const orderofproblemids=req.body.orderofproblemids;
  const contestid=req.params.contestid;
  let i=0;
  for(i=0;i<orderofproblemids.length;i++){
    console.log(orderofproblemids);
    let problem = await UnpublishedProblem.findByPk(orderofproblemids[i]);
    problem.dataValues.contestid=contestid;
    problem.problemnum=i+1;
    console.log(problem);
    const updatedproblem = await UnpublishedProblem.update(problem.dataValues, {
      where: { problemid : orderofproblemids[i]},
    })
    const contesttobeupdated= await Contestsdata.findByPk(contestid);
    // await contesttobeupdated.update({numberOfQuestions:orderofproblemids.length});
    console.log(updatedproblem);
  }
   return res.status(201).json("updatedproblem");
  }catch(error){
    console.log(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});


//This api is ready and tested
app.post('/scheduleacontest',verifyToken,async (req,res) => {
  if(req.user.role!='admin'){
    return res.json({"message":"you are not authorised"});
  }
  console.log(req.body)
  try{
  const contestName =req.body.contestName;
  const startDate =req.body.startDate;
  const endDate =req.body.endDate;
    const newContest =await Contestsdata.create({
      contestName,
      startDate,
      endDate
    }
    );
    return res.status(201).json(newContest);
  }catch(error){
    console.log(error);
    return res.status(501).json(error);
  }
});

//This api is ready and tested
app.put('/scheduleacontest',verifyToken,async (req,res) => {
  if(req.user.role!='admin'){
    return res.json({"message":"you are not authorised"});
  }
  console.log(req.body)
  try{
  const contestName =req.body.contestName;
  const startDate =req.body.startDate;
  const endDate =req.body.endDate;
  const contestId =req.body.contestId;
    const newContest =await Contestsdata.update({
      contestName,
      startDate,
      endDate
    },{where : { contestId: contestId }}
    );
    return res.status(201).json({newContest});
  }catch(error){
    console.log(error);
    return res.status(501).json(error);
  }
});

//This api is ready and tested
app.get('/Calendar/:page',async (req,res)=>{
  try{
    const currentdate =new Date;
    const page=req.params.page;
    const pageSize=2;
    const unpublishedQuestions=await Contestsdata.findAll({
      order: [['contestId', 'DESC']],
      limit: pageSize,
      offset: (page - 1) * pageSize,
      attributes:['startDate','endDate','contestName']
    });
    res.send(unpublishedQuestions);
  }catch(error){
    console.log(error);
    return res.status(501).json({error : "Internal server error"});
  }
});

//This api is ready and tested
app.get('/contest/:contestid',async(req,res)=>{
  try {
    const contestid =req.params.contestid;
    const contestdata= await Contestsdata.findByPk(contestid);
    if(contestdata==null||contestdata.dataValues==null){
      return res.send("no such contest");
    }
    let contesttime =contestdata.dataValues.startDate;
    const currentdate =new Date();
    if(contesttime>currentdate&&req.user.role!="admin"){
      return res.send("shuru to hone de bhai/bhen contest");
    }
    let allProblems=[];
    // let totalpoblems=contestdata.numberOfQuestions;
    let x=1;
    for(i=0;i<totalpoblems;i++){
      let problemid=contestid+`~`+x;
    let problem = await Problem.findByPk(problemid);
    allProblems.push(problem);
    x++;
  }
    console.log(allProblems)
    return res.send(allProblems);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

//This api is ready and tested
app.get('contest/:contestid/problem/:problemnumber',async(req,res)=>{
  try {
    const contestid =req.params.contestid;
    const contestdateandtime= await Contestsdata.findByPk(contestid);
    let contesttime =contestdateandtime.dataValues.date;
    const currentdate =new Date();
    if(contesttime>currentdate){
      return res.send("shuru to hone de bhai/bhen contest");
    }
    const problemnumber =req.params.problemnumber;
    const problemid = contestid+`$`+problemnumber;
    const problem = await UnpublishedProblem.findByPk(problemid);
    if(problem==null||problem.dataValues==null){
      return res.send("there is no problem like this")
    }
    console.log(problem)
    return res.send(problem);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});


//This api is ready and tested
app.post('/publishcontest/:contestid',verifyToken,async(req,res)=>{
  if(req.user.role!="admin"){
    return res.send("you are not authorised");
  } 
  const contestId =req.params.contestid;
      try{
        const contestproblems =await UnpublishedProblem.findAll({where:{ contestid: contestId }});
        // console.log(contestproblems);
        let i;
        for(i=0;i<contestproblems.length;i++){
          const published = await Problem.create({
            problemid:contestproblems[i].contestid+`~`+contestproblems[i].problemnum,
            problemName:contestproblems[i].problemName,
            problemStatement:contestproblems[i].problemStatement,
            problemInput:contestproblems[i].problemInput,
            problemOutput:contestproblems[i].problemOutput,
            problemNote:contestproblems[i].problemNote,
            timeLimit:contestproblems[i].timeLimit,
            memoryLimit:contestproblems[i].memoryLimit,
            testCases:contestproblems[i].testCases,
            solution:contestproblems[i].solution,
            difficulty:contestproblems[i].difficulty,
            tags:contestproblems[i].tags,
            sampleInput:contestproblems[i].sampleInput,
            sampleOutput:contestproblems[i].sampleOutput
          });

          const problemtobedeleted= await UnpublishedProblem.findByPk(contestproblems[i].problemid);
          problemtobedeleted.destroy();
        }
        return res.json({contestproblems});
      }catch(e){
        console.log(e);
        return res.send("rome error");
      }
});


app.get('/stoppractise',(req,res)=>{
  isHigherPriority=true;
  return res.send("set to higher");
});

app.get('/startpractise',(req,res)=>{
  isHigherPriority=false;
  processSubmission(isHigherPriority);
  return res.send("practise started");

});

// Now work and testing is pending on following issues and one thing is sumit for contest
// only after contest is finished
app.get('/standings/:contestid/page/:pageno',async(req,res)=>{
  const contestid =req.params.contestid;
  let pageno=req.params.pageno;
  const contestdata= await Contestsdata.findByPk(contestid);
  contestdata=contestdata.dataValues;
  const maxrank = contestdata.actualNumberOfParticipants;
  let contesttime =contestdata.date;
  const currentdate =new Date();
  if(contesttime>currentdate){
    return res.send("shuru to hone de bhai/bhen contest");
  }
  let standings;
  if(pageno<1){
    pageno=1;
  }
  let rank =(pageno-1)*200;
  let maxrankonpageno;
  if(max>=rank+200){
    maxrankonpageno=rank+200;
  }else{
    maxrankonpageno=maxrank;
  }
  for(let i=rank+1 ;i<maxrank+1;i++){
    const dd= await Contests.findByPk(contestid+'$'+rank);
    standings.push(dd);
  }
  return res.send(standings);
});

app.put('/managestandings',verifyToken,async (req,res)=>{
  if(req.user.role!='admin'){
    return res.json({"message":"you are not authorised"});
  }
  executeQueries(req.body.contestId);
  return res.json({"message":"reranked Successfully"});
});
app.listen(8000);