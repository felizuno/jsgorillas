(function() {
  
  App.dataManager.gameManager = {
    children: [],
    handlers: {
      newGame: 'makeNewGame',
      newRound: 'makeNewRound',
      playersChanged: 'makeNewGame',
      newSkyline: 'makeNewSkyline'
    },

    makeNewGame: function(pM) {
      var self = this;

      this.sendRequestFor('model', 'Game').soICan(function(newGame) {
        self.sendRequestFor('askGamePrefs', newGame).soICan(function(updatedGame) {
          var rectangleThatShouldBeRequested = new zot.rect(0, 0, 600, 800); // TODO
          updatedGame.init(rectangleThatShouldBeRequested);

          self.sendRequestFor('newRound', updatedGame).soICan(function(newRound) {
            newRound.roundNumber = 1;
            updatedGame.currentRound = newRound;
            self.currentGame = updatedGame;

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

        pM.resolve(newRound);
      });
    },

    makeNewSkyline: function(pM) {
      var screenWidth = this.currentGame.screenSize.width || 1000;
      var howMany = this.currentGame.buildingCount;

      var buildings = [];
      for (var i = 1; i <= howMany; i++) {
        var height = (Math.floor(Math.random() * 300) + 100);
        var top = canvasDims.height - height;
        var left = screenWidth * i;

        var building = new zot.rect(left, top, screenWidth, height);
        
        // Move this to the view
        // if (i % 3 === 0) {
        //   building.color = 'teal';
        // } else if (i % 5 === 0) {
        //   building.color = 'green';
        // } else {
          building.color = 'plum';
        // }

        building.windows = [];
        var xInc = ((screenWidth / 5) - 5);
        var yInc = 22; // (building.height / 8);
        var xStop = (left + screenWidth - xInc);
        var yStop = (top + height - yInc);

        for (var yPos = (top + yInc); yPos < yStop; yPos += yInc) {
          for (var xPos = (left + xInc); xPos < xStop; xPos += xInc) {
            w = new zot.rect(xPos, yPos, 5, 10);
            building.windows.push(w);
          }
        }

        var gorillaWidth = 28;  // replace later
        var gorillaHeight = 28; // replace later
        var gorillaLeft = Math.round(building.left + ((building.width - gorillaWidth) / 2));
        var gorillaTop = Math.round(building.top - gorillaHeight);

        if (howMany > 3) {
          // TODO: Accomodate more than 2 players
          if (i === 1 || i === (howMany - 2)) {
            building.gorilla = true; //'img/gorilla-left.png';
            // PLAYERS HAVE AN UPDATEPOSITION METHOD... USE IT
            // this.addPlayerPosition(new zot.rect(gorillaLeft, gorillaTop, gorillaWidth, gorillaHeight));
          }
        } else { // howMany = 3 (< 3 not allowed up top)
          if (i === 0 || i === 2) {
            building.gorilla = true; //'img/gorilla-left.png';
            // PLAYERS HAVE AN UPDATEPOSITION METHOD... USE IT
            // this.addPlayerPosition(new zot.rect(gorillaLeft, gorillaTop, gorillaWidth, gorillaHeight));
          }
        }

        buildings.push(building);
      }

      this.currentRound.skyline = buildings;

      pM.resolve(buildings);
    }
  };

})();