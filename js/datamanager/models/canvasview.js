(function() {

  var module = App.dataManager.modelManager.models.canvas = function() {};

  module.prototype = {
    init: function(config) {
      this.$el = $('<canvas>')
        .addClass(config.name)
        .width(config.width)
        .height(config.height)
        .appendTo('.game-view'); // Probably need explicit width and height

      this.ctx = this.$el[0].getContext('2d');

      if (config.touchable) {
        this.becomeTouchSensitive();
      }
    },

    // fillRect(zotRect, color)

    becomeTouchSensitive: function() {
        var self = this;

        this.$el.mousedown(function(e) {
          // these cause reflow!
          var x = e.clientX - this.$el.offset().left - 10;
          var y = e.clientY - this.$el.offset().top - 10;
          console.log('Click is at: ', x, y);

          var click = new zot.rect(x - 10, y - 10, 50, 50);
          if (this.gorillas) {
            _.each(this.gorillas, function(gorilla, i) {
              // debugger;
              if (click.intersects(gorilla)) {
                if (i === 0) {
                  self.left = false;
                } else {
                  self.left = true;
                }

                self.tracking = true;
                console.log('Gorilla!!!', gorilla);
                Utils.ironSights.down(e, this.$el, gorilla.top);
              }
            });
          }
        })
        .mouseup(function(e) {
          if (self.tracking) {
            var aim = Utils.ironSights.up(e, this.$el, self.left);
            var toss = App.dataManager.Physics.simulateToss(aim.theta, aim.velocity, aim.origin);
            self.renderThrow(toss);
          }

          // Comment out for rapid fire!
          self.tracking = false;
        });
    }
  };
})();
