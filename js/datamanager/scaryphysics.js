(function() {
  App.dataManager.Physics = {
    gravity: .98,

    simulateToss: function(theta, velocity, origin) {
      var g = this.gravity;

      return {
        vX: (velocity * Math.cos(theta)),
        vY: (velocity * Math.sin(theta)),
        origin: origin,
        left: false,

        positionAt: function (time) {
          time = time / 60;
          
          if (this.left) {
            var x = origin[0] - (this.vX * time);
          } else {
            var x = origin[0] + (this.vX * time);
          }
          // debugger;
          var y = (this.vY * time) - (0.5 * g * (time * time)) - origin[1];
          y = Math.abs(y);

          return {
            x: Math.round(x),
            y: Math.round(y)
          };
        },

        xMax: function() {
          return (vX * this.hangTime());
        },

        yMax: function() {
          var pt = this.peakTime();
          var ymax = ((this.vY * pt) - (0.49 * pt * 2));
          return ymax;
        },

        peakTime: function() {
          return (this.hangTime() / 2);
        },

        hangTime: function() {
          var ht = (0.204 * this.vY);
          return ht;
        },

        peakPosition: function() {
          var pt = this.peakTime();
          return {
            x: this.positionAt(pt).x,
            y: this.yMax(),
            time: pt
          };
        }
      }
    }
  };

})();
