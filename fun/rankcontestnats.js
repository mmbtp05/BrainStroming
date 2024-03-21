const Contestinprogress =require('../model/contestinprogress.js');
const commonstandings =require('../model/commonstandings');
const User = require('../model/user.js');
const ContestsOfUser = require('../model/contestsOfUser.js');
async function executeQueries(contestId){
  try {
    const sortedData = await Contestinprogress.findAll({
      order: [
        ['score', 'DESC'],
        ['rating', 'ASC'] 
      ],
      attributes: ['userId', 'score', 'rating','finalrating','A','B','C','D'],
      raw: true
    });
    
    let rank =1;
    for(rank=1;rank<=sortedData.length;rank++){
      const addedstandings =await commonstandings.create({
        contestIdandRank: contestId+`$`+rank,
        userId:sortedData[rank-1].userId,
        score:sortedData[rank-1].score,
        A:sortedData[rank-1].A,
        B:sortedData[rank-1].B,
        C:sortedData[rank-1].C,
        D:sortedData[rank-1].D,
      });
      const currentuser =await User.findByPk(sortedData[rank-1].userId);
      const userData =currentuser.dataValues;
      await currentuser.update({
        totalcontests:userData.totalcontests+1,
        rating:Math.floor(546.57 + 0.69 * userData.rating + -0.02 * rank)
      });
      let ttcontests =userData.totalcontests+1;
      const ccc =await ContestsOfUser.create({
        useridContestNumberOfUser: userData.userId+ttcontests,
        contestid: contestId,
        Rank :rank,
        initialrating :userData.rating,
        finalrating :Math.floor(546.57 + 0.69 * userData.rating + -0.02 * rank)
      });
    }
  } catch (error) {
    console.error('Error executing queries:', error.message);
  }
}

module.exports = executeQueries;