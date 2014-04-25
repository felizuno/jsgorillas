(function() {
  App.viewManager.gorillas.physics = {
    gravity: 0.98,

    simulateToss: function(config) {
      var g = this.gravity;
      return {
        vX: (config.velocity * Math.cos(config.theta)),
        vY: (config.velocity * Math.sin(config.theta)),
        origin: config.origin,
        left: (config.theta > 0),

        positionAt: function (time) {
          var x, y;
          time = time / 60;

          if (this.left) {
            x = config.origin.left - (this.vX * time);
            y = (this.vY * time) - (0.5 * g * (time * time)) - config.origin.top;
          } else {
            x = config.origin.right() + (this.vX * time);
            y = (-this.vY * time) - (0.5 * g * (time * time)) - config.origin.top;
          }
          // debugger;
          // y = (this.vY * time) - (0.5 * g * (time * time)) - config.origin.top;
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
