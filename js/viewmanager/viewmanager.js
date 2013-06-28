(function() {
      // window.requestAnimationFrame = window.requestAnimationFrame
      //   || window.mozRequestAnimationFrame
      //   || window.webkitRequestAnimationFrame
      //   || window.msRequestAnimationFrame;
  App.viewManager = {
    children: ['inputManager', 'canvasManager', 'styleManager'],
    handlers: {
      greetHumans: 'askHowManyPlayers'
    },

    init: function() {
      var self = this;
      _.each(this.children, function(childName) {
        if (self[childName].init) {
          self[childName].init();
        }
      });
    },

    askHowManyPlayers: function() {
      var self = this;
      var rawTemplate = $('#how-many-players-template').html();

      this.sendRequestFor('input', rawTemplate).soICan(function(response) {
        console.log(response);
        self.sendRequestFor('updatePlayerCount', response.count).soICan(function(players) {
          self.showPlayerConfigUI(players);
        });
      });
    },

    showPlayerConfigUI: function(players) {
      var self = this;
      var rawTemplate = $('#player-config-template').html();

      _.each(players, function(player) {
        var playerConfigUI = _.template(rawTemplate, player);

        self.sendRequestFor('input', playerConfigUI).soICan(function(responses) {
          _.each(responses, function(response, key) {
            player[key] = response;
          });
        });
      });
    },




////////////////////////////////////////////////////
    renderForeground: function(skyline) {
      var self = this;

      _.each(skyline, function(building, index) {
        self._drawBuilding(building);
        building.gorilla ? self._placeGorillaOnTop(building) : '';
      });
    },

    renderThrow: function(toss) {
      var self = this;
      var start = Date.now();
      var hangTime = toss.hangTime();
      // console.log('throw from', toss.origin, hangTime);

      var step = function(timestamp) {
        var progress = timestamp - start;
        var pos = toss.positionAt(progress);
        var imgData = self.cityFg.ctx.getImageData(pos.x, pos.y, 1, 1).data;

        if (imgData[0] !== 0  || imgData[1] !== 0 || imgData[2] !== 0) {
          var circle = new zot.arc(pos, 50);
          _.each(self.gorillas, function(gorilla, i) {
            if (circle.intersects(gorilla)) {
              console.log('HIT!!!!', i);
            }
          });

          // Clear the circle
          self.cityFg.ctx.globalCompositeOperation = 'destination-out';
          self.cityFg.ctx.beginPath();
          self.cityFg.ctx.arc(pos.x, pos.y, 50, 0, 2 * Math.PI);
          self.cityFg.ctx.closePath();
          self.cityFg.ctx.fill(); 
          self.cityFg.ctx.globalCompositeOperation = 'source-over';

          return;
        }

        var width = 10;
        if (!self.left) {
          width *= -1;
        }

        ctx.fillRect(pos.x, pos.y, width, 10);
        // debugger;
        if (progress < hangTime * 1000) { // should cut this off at the edges of the canvas
          requestAnimationFrame(step);
        }

        setTimeout(function() {
          requestAnimationFrame(function() {
            ctx.clearRect(pos.x, pos.y, width, 10);
          })
        }, 20);
      };
      
      var ctx = this.ctx || this.el.find('canvas')[0].getContext('2d');
      ctx.fillStyle = 'yellow';

      requestAnimationFrame(step);
    },

    renderCity: function(skyline) {
      _.each(this.children)
      this.ctx.canvas.width = this.ctx.canvas.width;
      
      this.gorillas = [];

      var skyline = App.currentGame.get('config').skyline;
      this.renderForeground(skyline);
    },

    _drawBuilding: function(building) {
      this.ctx.fillStyle = building.color;
      this.ctx.fillRect(building.left, building.top, building.width, building.height);
      this._addWindowsToBuilding(building);
    },

    _addWindowsToBuilding: function(building) {
      var dark = Math.round((Math.random() * 15) + 7);
      for (var i = 0; i < building.windows.length; i++) {
          var w = building.windows[i];
          // debugger;
          if (Math.pow(i, 2) % dark === 4) {
            this.ctx.fillStyle = '#333';
          } else {
            this.ctx.fillStyle = 'yellow';
          }

          this.ctx.fillRect(w.left, w.top, w.width, w.height);
      }
    },

    _placeGorillaOnTop: function(building) {
      var self = this;
      var x = Math.round(building.left + ((building.width - 28) / 2));
      var y = Math.round(building.top - 28);
      
      self.gorillas = [];
      var gorilla = new Image();
      gorilla.src = building.gorilla;
      gorilla.onload = function(){
        self.ctx.drawImage(gorilla, x, y);
        self.gorillas.push(new zot.rect(x, y, 28, 28));
      }
    }
  };

})();