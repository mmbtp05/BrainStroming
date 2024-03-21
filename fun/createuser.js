const User =require('../model/user');
async function createUser(req, res) {
try {
    const userId = req.body.userId;
    const emailid = req.body.emailid;
    const password = req.body.password;
    const totalsubmissions = req.body.totalsubmissions;
    const newUser = await User.create({
      userId,
      emailid,
      password,
      totalsubmissions
  });
  console.log(newUser);
    return res.status(201).json(newUser);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
module.exports={
    createUser
}