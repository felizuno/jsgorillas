(function() {
  
  App.viewManager.gorillas = {
    handlers: {
      respondToTouch: 'handleTouch'
    },
    playerLocations: [],

    handleTouch: function(pM) {
      var self = this;
      var toss = this.physics.simulateToss(pM.payload);
      
      this.sendRequestFor('canvasContext', 'fg2').soICan(function(buildingCtx) {
        self.sendRequestFor('canvasContext', 'fg3').soICan(function(bananaCtx) {
          self.renderThrow(bananaCtx, buildingCtx, toss);
        });
      });
    },

    renderRound: function(layerName, ctx, payload) {
      var self = this;

      if (layerName == 'fg1') {
        this.renderSkyline(ctx, payload.skyline, 0.5);
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
    },

    renderSky: function(ctx) {
      var self = this;
      var start = Date.now();

      this.sendRequestFor('gameDims').soICan(function(dims) {
        ctx.fillStyle = 'lightblue';
        ctx.fillRect(0, 0, dims.width, dims.height);

        ctx.fillStyle = 'yellow';
        ctx.beginPath();
        ctx.arc((dims.width / 2), 100, 75, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.fill(); 
        ctx.globalCompositeOperation = 'source-over';

        // Planes
        var xPos = 0;
        var step = function(timestamp) {
          var progress = timestamp - start;
          xPos += 20;
          ctx.fillStyle = 'red';
          ctx.fillRect(xPos, 300, 100, 20);
          // debugger;
          //if (progress < hangTime * 1000 || true) { //TODO should cut this off at the edges of the canvas
          if (xPos < dims.width) {
            requestAnimationFrame(step);
          }

          setTimeout(function() {
            requestAnimationFrame(function() {
              ctx.fillStyle = 'lightblue';
              ctx.fillRect(xPos - 100, 300, 100, 20);
            });
          }, 12);
        };

        setInterval(function() {
          xPos = 0
          requestAnimationFrame(step);
        }, 10000);
      });

    },

    renderSkyline: function(ctx, skyline, alpha) {
      var self = this;

      ctx.globalAlpha = alpha || 1;

      _.each(skyline, function(building, index) {
        self._drawBuilding(ctx, building);
        building.gorilla ? self._placeGorillaOnTop(ctx, building) : '';
      });

      ctx.globalAlpha = 1;
    },

    renderThrow: function(bananaCtx, buildingCtx, toss) {
      var self = this;
      var start = Date.now();
      var hangTime = toss.hangTime();

      var step = function(timestamp) {
        var progress = timestamp - start;
        var pos = toss.positionAt(progress);
        var future = toss.positionAt(progress + 1);
        var imgData = buildingCtx.getImageData(future.x, future.y, 1, 1).data;

        if (imgData[0] !== 0  || imgData[1] !== 0 || imgData[2] !== 0) {
          var circle = new zot.arc(pos, 50);

          // Clear the circle
          buildingCtx.globalCompositeOperation = 'destination-out';
          buildingCtx.beginPath();
          buildingCtx.arc(pos.x, pos.y, 50, 0, 2 * Math.PI);
          buildingCtx.closePath();
          buildingCtx.fill(); 
          buildingCtx.globalCompositeOperation = 'source-over';

          self.sendRequestFor('player', 'all').soICan(function(players) {
            _.each(players, function(player) {
              if (circle.intersects(player.position.location)) {
                console.log('HIT!!!!', player.name);
                self.sendRequestFor('newRound').soICan(function(newRound) {
                  self.announce('roundChange', newRound);
                });
              }
            });
          });

          return;
        }

        var width = 10;

        bananaCtx.fillRect(pos.x, pos.y, width, 10);
        if (pos.x > 0 && pos.x < 1900 && pos.y > -600) {
          requestAnimationFrame(step);
        }

        setTimeout(function() {
          requestAnimationFrame(function() {
            bananaCtx.clearRect(pos.x, pos.y, width, 10);
          })
        }, 20);
      };
      
      bananaCtx.fillStyle = 'yellow';

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
      // debugger;
      ctx.fillStyle = building.color;
      // ctx.fillRect(40, 40, 40, 40);
      ctx.fillRect(building.left, building.top, building.width, building.height);
    },

    _addWindowsToBuilding: function(ctx, building) {
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