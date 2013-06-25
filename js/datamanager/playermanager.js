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
          newPlayer.name = 'Player' + i;
          self.players.push(newPlayer);
        });
      }

      pM.resolve(this.players)
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