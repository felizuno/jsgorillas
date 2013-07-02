(function() {
  
  App.viewManager.gorillas = {
    renderGame: function(layerName, ctx, payload) {
      if (layerName == 'sky') {
        this.renderSky(ctx);
      }
    },
    
    renderRound: function(layerName, ctx, payload) {
      this.renderForeground(ctx, payload.skyline);
    },

    renderSky: function(ctx, rect) {
      ctx.fillStyle = 'lightblue';
      ctx.fillRect(0, 0, 1000, 1000); //REPLACE
    },

    renderForeground: function(ctx, skyline) {
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
        var imgData = ctx.cityFg.ctx.getImageData(pos.x, pos.y, 1, 1).data;

        if (imgData[0] !== 0  || imgData[1] !== 0 || imgData[2] !== 0) {
          var circle = new zot.arc(pos, 50);
          _.each(self.gorillas, function(gorilla, i) {
            if (circle.intersects(gorilla)) {
              console.log('HIT!!!!', i);
            }
          });

          // Clear the circle
          ctx.cityFg.ctx.globalCompositeOperation = 'destination-out';
          ctx.cityFg.ctx.beginPath();
          ctx.cityFg.ctx.arc(pos.x, pos.y, 50, 0, 2 * Math.PI);
          ctx.cityFg.ctx.closePath();
          ctx.cityFg.ctx.fill(); 
          ctx.cityFg.ctx.globalCompositeOperation = 'source-over';

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
      console.log(building.left, (building.top), building.width, building.height);
      ctx.fillRect(building.left, (building.top), building.width, building.height);
      this._addWindowsToBuilding(ctx, building);
    },

    _addWindowsToBuilding: function(ctx, building) {
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
      gorilla.src = building.gorilla;
      gorilla.onload = function(){
        self.ctx.drawImage(gorilla, x, y);
        self.gorillas.push(new zot.rect(x, y, 28, 28));
      }
    }

  };

})();