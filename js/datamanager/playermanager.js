(function() {
  
  App.dataManager.playerManager = {
    players:[],
    handlers: {
      updatePlayerCount: 'addPlayers',
      player: 'returnPlayer'    
    },

    addPlayers: function(pM) {
      var self = this;
      var howMany = pM.payload || 1;

      for (var i = 1; i <= howMany; i++) {
        this.sendRequestFor('model', 'Player').soICan(function(newPlayer) {
          self.players.push(newPlayer);
        });
      }

      console.log(this.players);
      // Is an announcement so no resolve
    },

    returnPlayer: function(pM) {
      if (_.isNumber(pM.payload)) {
        pM.resolve(this.players[pM.payload - 1]);
      } else if (_.isString(pM.payload)) {
        pM.resolve(_.fine(this.players, function(player) { return player.name == pM.payload}));
      } // Also need to handle an object?
    }
  };

})();