(function() {
  
  App.viewManager.gorillas = {
    handlers: {
      respondToTouch: 'handleTouch'
    },
    playerLocations: [],

    handleTouch: function(pM) {
      var self = this;
      var toss = this.physics.simulateToss(pM.payload);
      
      this.sendRequestFor('canvasContext', 'fg2').soICan(function(ctx) {
        self.renderThrow(ctx, toss);
      });
    },

    renderRound: function(layerName, ctx, payload) {
      var self = this;

      if (layerName == 'fg1') {
        this.renderSkyline(ctx, payload.skyline);
      } else if (layerName == 'fg2') {
        this.renderSkyline(ctx, payload.skyline);
        _.each(payload.skyline, function(building) {
            self._addWindowsToBuilding(ctx, building);
            if (building.gorilla) {
              self.announce('registerTouchTarget', building.gorilla);
              self.addPlayerPosition(building.gorilla);
            }
        });
      }
    },

    addPlayerPosition: function(player) {
      // player.payload should be a zot.rect
      this.playerLocations = _.reject(this.playerLocations, function(target) {
        return target.who === player.who;
      });

      this.playerLocations.push(player);
      console.log('Targets: ', this.playerLocations);
    },

    renderSky: function(ctx, rect) {
      ctx.fillStyle = 'lightblue';
      ctx.fillRect(0, 0, rect.width, rect.height);
    },

    renderSkyline: function(ctx, skyline) {
      var self = this;

      _.each(skyline, function(building, index) {
        self._drawBuilding(ctx, building);
        building.gorilla ? self._placeGorillaOnTop(ctx, building) : '';
      });
    },

    renderThrow: function(ctx, toss) {
      var self = this;
      var start = Date.now();
      var hangTime = toss.hangTime();
      // console.log('throw from', toss.origin, hangTime);

      var step = function(timestamp) {
        var progress = timestamp - start;
        var pos = toss.positionAt(progress);
        var imgData = ctx.getImageData(pos.x, pos.y, 1, 1).data;

        if (imgData[0] !== 0  || imgData[1] !== 0 || imgData[2] !== 0) {
          var circle = new zot.arc(pos, 50);
          _.each(self.gorillas, function(gorilla, i) {
            if (circle.intersects(gorilla)) {
              console.log('HIT!!!!', i);
            }
          });

          // Clear the circle
          ctx.globalCompositeOperation = 'destination-out';
          ctx.beginPath();
          ctx.arc(pos.x, pos.y, 50, 0, 2 * Math.PI);
          ctx.closePath();
          ctx.fill(); 
          ctx.globalCompositeOperation = 'source-over';

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
      
      ctx.fillStyle = 'yellow';

      requestAnimationFrame(step);
    },

    renderCity: function(skyline) {
      _.each(this.children)
      ctx.canvas.width = ctx.canvas.width;
      
      this.gorillas = [];

      var skyline = App.currentGame.get('config').skyline;
      this.renderForeground(skyline);
    },

    _drawBuilding: function(ctx, building) {
      // console.log('$$$$');
      // debugger;
      ctx.fillStyle = building.color;
      // ctx.fillRect(40, 40, 40, 40);
      console.log('Building ', building.left, building.top);
      ctx.fillRect(building.left, building.top, building.width, building.height);
    },

    _addWindowsToBuilding: function(ctx, building) {
      console.log('!!WINDOWS!!');
      // debugger;
      var dark = Math.round((Math.random() * 15) + 7);
      for (var i = 0; i < building.windows.length; i++) {
          var w = building.windows[i];
          // debugger;
          if (Math.pow(i, 2) % dark === 4) {
            ctx.fillStyle = '#333';
          } else {
            ctx.fillStyle = 'yellow';
          }

          ctx.fillRect(w.left, w.top, w.width, w.height);
      }
    },

    _placeGorillaOnTop: function(ctx, building) {
      var self = this;

      console.log('Gorilla party!');
      var x = Math.round(building.left + ((building.width - 28) / 2));
      var y = Math.round(building.top - 28);
      
      self.gorillas = [];
      var gorilla = new Image();
      gorilla.src = building.gorilla.img;
      gorilla.onload = function(){
        ctx.drawImage(gorilla, x, y);
      }
    }

  };

})();