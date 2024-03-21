const Sequelize = require('sequelize');
const { contestinprogress } = require('../model/contestinprogress');
function calculateRatingChanges(oldRatings, ranks, k = 32) {
    if (oldRatings.length !== ranks.length) {
      throw new Error('Input arrays must have the same length.');
    }
    const ratingChanges = [];
    for (let i = 0; i < oldRatings.length; i++){
      const expectedScore = 1 / (1 + Math.pow(10, (ranks[i] - oldRatings[i]) / 400));
      const outcome = ranks[i] > 0 ? 1 : 0;
  
      const ratingchange = k * (outcome - expectedScore);
      ratingChanges.push(ratingchange);
    }
    return ratingChanges;
}

module.exports={
  calculateRatingChanges
};