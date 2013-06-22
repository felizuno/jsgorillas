(function() {

  window.Utils = {
    captureCanvasProps: function() {
      var $canvas = $('canvas');
      var w = $canvas.width();
      var h = $canvas.height();

      return {
        width: w,
        height: h
      };
    },

    convertToRadian: function(degrees) {
      var rad = degrees * (Math.PI / 180);
      return rad;
    },

    ironSights: {
      down: function(e, $canvas, top) {
        if (!this.offsetX) {
          this.offsetX = $canvas.offset().left;
        }

        if (!this.offsetY) {
          this.offsetY = $canvas.offset().top;
        }

        var x = e.clientX - this.offsetX;
        var y = e.clientY - this.offsetY;
        // console.log('Down is at: ', x, y);

        this.top = top - 10;
        this.x0 = x;
        this.y0 = y;
        this.t0 = Date.now();
      },

      up: function(e, $canvas, left) {
        var x = e.clientX - this.offsetX;
        var y = e.clientY - this.offsetY;
        // console.log('Up is at: ', x, y);
        this.x1 = x;
        this.y1 = y;
        this.t1 = Date.now();
        if (left) {
          var deltaX = this.x1 - this.x0;
        } else {
          var deltaX = this.x0 - this.x1;
        }
        var deltaY = this.y1 - this.y0;
        var deltaT = (this.t1 - this.t0) * 0.001;

        var theta = Math.atan(deltaY / deltaX);
        var velocity = (Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2)) / 5);

        return {
          theta: theta,
          velocity: velocity,
          origin: [this.x0, this.top]
        };
      }
    }
  };

})();