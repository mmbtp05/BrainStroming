const Sequelize = require('sequelize');
const rankContstants =require('./rankcontestnats');
const calculateRatingChanges=require('./ratingchanges');
const contestinprogress =require('../model/contestinprogress');
const User = require('../model/user');
const Contests = require('../model/contest');
const ContestsOfUser = require('../model/contestsOfUser');
async function finalranks (contestid){
    const dataofcontestinprogress = await contestinprogress.findAll({});
    const oldRatings=dataofcontestinprogress.ratings;
    let ranks =[];
    let i;
    let sizeofoldratings =oldRatings.length;
    for(i=1;i<=sizeofoldratings;i++){
        ranks.push(i);
    }
    const ratingChanges=calculateRatingChanges(oldRatings,ranks,k=32);
    for(i=0;i<dataofcontestinprogress.length;i++){
      const aa= await Contests.create({
        contestidrank:contestid+ranks[i],
        userid:dataofcontestinprogress.userid,
        ratingChanges: ratingChanges[i],
        initialrating :oldRatings[i],
        score :dataofcontestinprogress.score
      });
      console.log(aa);
      const userji=User.findByPk(dataofcontestinprogress.userid);
      const bb=await ContestsOfUser.create({
        useridContestNumberOfUser:(userji.userid+userji.totalcontests+1),
        contestid :contestid,
        Rank:ranks[i]
      });
      console.log(bb);
      User.increment('rating', {
        by: ratingChanges[i],
        where: {userId :dataofcontestinprogress.userid},
      }).then(([affectedRowsCount]) => {
        console.log(`Updated ${affectedRowsCount} row(s).`);
      });
      User.increment('totalcontests', {
        by: 1,
        where: {userId :dataofcontestinprogress.userid},
      }).then(([affectedRowsCount]) => {
        console.log(`Updated ${affectedRowsCount} row(s).`);
      });
    }
    contestinprogress.destroy({
        where: {}, 
      }).then((r) => {
        console.log(`Deleted ${r} row(s).`);
      });
      return {"message" :"kaam hogaya"};
}
module.exports={
    finalranks
}