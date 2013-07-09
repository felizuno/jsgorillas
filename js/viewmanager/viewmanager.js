(function() {
      // window.requestAnimationFrame = window.requestAnimationFrame
      //   || window.mozRequestAnimationFrame
      //   || window.webkitRequestAnimationFrame
      //   || window.msRequestAnimationFrame;
  App.viewManager = {
    children: ['inputManager', 'canvasManager', 'styleManager'],
    handlers: {
      gameDims: 'reportGameDims',
      greetHumans: 'showPlayerCountUI',
      gameChange: 'updateForNewGame',
      askPlayerPrefs: 'showPlayerConfigUI',
      askGamePrefs: 'showGameConfigUI'
    },

    init: function() {
      var self = this;

      var $view = $('.game-view');
      this.gameViewDims = {
        width: $view.width(),
        height: $view.height()            
      };

      _.each(this.children, function(childName) {
        if (self[childName].init) {
          self[childName].init(self.gameViewDims);
        }
      });

      this.sendRequestFor('canvas', 'fg3').soICan(function(canvas) {
        self.sendRequestFor('makeTouchable', canvas).soICan(function(touchableCanvas) {
          // TODO ? 
        });
      });
    },

    reportGameDims: function(pM) {
      pM.resolve(this.gameViewDims);
    },

    showPlayerCountUI: function() {
      var self = this;
      var rawTemplate = $('#how-many-players-template').html();

      this.sendRequestFor('input', rawTemplate).soICan(function(response) {
        console.log(response);
        self.announce('addPlayers', response.count);
      });
    },

    showPlayerConfigUI: function(pM) {
      var self = this;
      var rawTemplate = $('#player-config-template').html();
      var player = pM.payload;
      var playerConfigUI = _.template(rawTemplate, player);

      self.sendRequestFor('input', playerConfigUI).soICan(function(responses) {
        _.each(responses, function(response, key) {
          player[key] = response;
        });

        pM.resolve(player);
      });
    },
    // THIS IS HELLA DUPLICATED FROM ABOVE
    showGameConfigUI: function(pM) {
      var self = this;
      var rawTemplate = $('#game-config-template').html();
      var game = pM.payload;
      var gameConfigUI = _.template(rawTemplate, game);
      
      self.sendRequestFor('input', gameConfigUI).soICan(function(responses) {
        _.each(responses, function(response, key) {
          game[key] = response;
        });

        pM.resolve(game);
      });
    },

    updateForNewGame: function(pM){
      var self = this;

      this.sendRequestFor('canvasContext', 'bg1').soICan(function(ctx) {
        self.gorillas.renderSky(ctx, self.gameViewDims);
      });

      this.updateForNewRound({ payload: pM.payload.currentRound });
    },

    updateForNewRound: function(pM){
      var self = this;

      this.sendRequestFor('canvasContext', 'fg1').soICan(function(ctx) {
        self.gorillas.renderRound('fg1', ctx, pM.payload);
      });

      this.sendRequestFor('canvasContext', 'fg2').soICan(function(ctx) {
        self.gorillas.renderRound('fg2', ctx, pM.payload);
      });

      // THIS SHOULD MOVE TO GORILLAS
      _.each(pM.payload.skyline, function(building) {
        if (building.gorillaTouchTarget) {
          self.announce('registerTouchTarget', building.gorillaTouchTarget);
        }
      });
    }
  };

})();