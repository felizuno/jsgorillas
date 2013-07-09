(function() {
  
  App.dataManager.gameManager = {
    children: ['gorillas'],
    handlers: {
      newGame: 'makeNewGame',
      newRound: 'makeNewRound',
      playersChanged: 'makeNewGame',
      newMap: 'makeNewMap'
    },

    makeNewGame: function(pM) {
      var self = this;

      this.sendRequestFor('model', 'Game').soICan(function(newGame) {
        self.sendRequestFor('askGamePrefs', newGame).soICan(function(updatedGame) {
          var rectangleThatShouldBeRequested = new zot.rect(0, 0, 600, 800); // TODO
          updatedGame.init(rectangleThatShouldBeRequested);
          self.currentGame = updatedGame; // Too early

          self.sendRequestFor('newRound', updatedGame).soICan(function(newRound) {
            newRound.roundNumber = 1;
            updatedGame.currentRound = newRound;

            self.announce('gameChange', self.currentGame);
          });
        });
      });
    },

    makeNewRound: function(pM) {
      var self = this;

      this.sendRequestFor('model', 'Round').soICan(function(newRound) {
        if (self.currentGame) {
          newRound.roundNumber = self.currentGame.pastRounds.length + 1;
          self.currentGame.newRound(newRound); // Logic in the game should bump the current round to the pastRounds
        }

        self.sendRequestFor('newMap').soICan(function(newSkyline) {
          pM.resolve(newRound);
        });
      });
    },

    makeNewMap: function(pM) {
      var self = this;

      this.sendRequestFor('gameDims').soICan(function(dimensions) {
        console.log('dimensions', dimensions);
        var newSkyline = self.gorillas.makeSkyline(dimensions.width, self.currentGame.buildingCount); // get real values
        self.currentGame.currentRound.skyline = newSkyline;
        pM.resolve(newSkyline);
      });
    }
  };

})();