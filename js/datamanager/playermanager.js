(function() {
  
  App.dataManager.playerManager = {
    players:[],
    handlers: {
      addPlayers: 'addPlayers',
      player: 'returnPlayer'  
    },

    addPlayers: function(pM) {
      var self = this;
      var howMany = pM.payload || 1;

      _.each(_.range(howMany), function(number) {
        self.sendRequestFor('model', 'Player').soICan(function(newPlayer) {
          number++;
          newPlayer.name = 'Player' + number;

          self.sendRequestFor('askPlayerPrefs', newPlayer).soICan(function(updatedPlayer) {
            self.players.push(updatedPlayer);

            if (number === howMany) {
              self.announce('playersChanged');
            }
          })
        });
      });
    },

    returnPlayer: function(pM) {
      if (_.isNumber(pM.payload)) {
        pM.resolve(this.players[pM.payload - 1]);
      } else if (_.isString(pM.payload)) {
        if (pM.payload == 'all') {
          pM.resolve(this.players);
        } else {
          pM.resolve(_.fine(this.players, function(player) { return player.name == pM.payload}));
        }
      } // Also need to handle an object?
    }
  };

})();