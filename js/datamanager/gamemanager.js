(function() {
  
  App.dataManager.gameManager = {
    children: [],
    handlers: {
      newGame: 'makeNewGame',
      newRound: 'MakeNewRound'
    },
    
    roundCount: 0,

    makeNewGame: function(pM) {

    },

    makeNewRound: function(pM) {
      this.roundCount++;
      var self = this;

      this.sendRequestFor('model', 'Round').soICan(function(newRound) {
          newRound.roundNumber = this.roundCount;
          self.currentRound = newRound;
          pM.resolve(newRound);
      });
    }
  };

})();