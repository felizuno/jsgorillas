(function() {
  
  App.dataManager.gameManager = {
    children: [],
    handlers: {
      newGame: 'makeNewGame',
      newRound: 'MakeNewRound',
      playersChanged: 'makeNewGame'
    },
    
    roundCount: 0,

    makeNewGame: function(pM) {
      var self = this;

      this.sendRequestFor('model', 'Game').soICan(function(newGame) {
        self.sendRequestFor('askGamePrefs', newGame).soICan(function(updatedGame) {
          var rectangleThatShouldBeRequested = new zot.rect(0, 0, 600, 800); // TODO
          updatedGame.init(rectangleThatShouldBeRequested);
          self.currentGame = updatedGame;
          self.announce('gameChange', self.currentGame);
        });
      });
    },

    makeNewRound: function(pM) {
      this.roundCount++;
      var self = this;

      this.sendRequestFor('model', 'Round').soICan(function(newRound) {
          newRound.roundNumber = self.roundCount;
          self.currentRound = newRound;
          pM.resolve(newRound);
      });
    }
  };

})();