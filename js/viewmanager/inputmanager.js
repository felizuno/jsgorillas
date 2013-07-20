(function() {
  
  App.viewManager.inputManager = {
    touchTargets: [],
    touchTracker: [],
    inputRequestQueue: [],
    handlers: {
      makeTouchable: 'enableTouchInput',
      registerTouchTarget: 'addTouchTarget',
      touchTargets: 'getTouchTargets',
      input: 'queueInputRequest'      
    },

    init: function() {
      var self = this;

      $('.reset').click(function(){
        self.sendRequestFor('newRound').soICan(function(newRound) {
          self.announce('roundChange', newRound);
        });
      });
    },

    enableTouchInput: function(pM) {
      if (!pM.payload.touchable) {
        pM.payload.$el.on('touchstart', _.bind(this.processTouchStart, this));
        pM.payload.$el.on('touchend', _.bind(this.processTouchEnd, this));
        pM.payload.touchable = true;
      }

      pM.resolve(pM.payload); // TODO: empty resolve should use payload instead of doing this
    },

    addTouchTarget: function(pM) {
      // pM.payload should be a zot.rect
      this.touchTargets = _.reject(this.touchTargets, function(target) {
        return target.who === pM.payload.who;
      });

      this.touchTargets.push(pM.payload);
    },

    getTouchTargets: function(pM) {
      pM.resolve(this.touchTargets);
    },

    queueInputRequest: function(pM) {
      this.inputRequestQueue.push(pM);

      if (!this.runningRequestQueue) {
        this._runRequestQueue();
      }
    },

    processTouchStart: function(origEvent) {
      var self = this;
      var e = origEvent.originalEvent;

      _.each(e.changedTouches, function(touch) {
        var zotRect = new zot.rect(touch.clientX - 20, touch.clientY - 20, 40, 40); // TODO: Build the rect to represent the cussioned touch

        _.each(self.touchTargets, function(target) {
          if (zotRect.intersects(target.touchArea)) {
            touch.origin = target.location;
            self.touchTracker.push(touch);
            return;
          }
        });
      });
    },

    processTouchEnd: function(origEvent) {
      var e = origEvent.originalEvent.changedTouches[0]; // IS IT REALLY ALWAYS JUST THE ONE?

      var tracked = _.find(this.touchTracker, function(touch) {
        return touch.identifier === e.identifier;
      });

      if (tracked) {
        var deltaX = e.clientX - tracked.clientX;
        var deltaY = e.clientY - tracked.clientY;
        var theta = Math.atan(deltaY / deltaX);
        var velocity = (Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2)) / 5); // Magic Number 5

        this.announce('respondToTouch', {
          theta: theta,
          velocity: velocity,
          origin: tracked.origin
        });
      }
    },

    _runRequestQueue: function() {
      var self = this;

      this.runningRequestQueue = true;

      var pM = this.inputRequestQueue.shift();
      if (!pM) { return; }

      var $panel = $('.input-panel').html(pM.payload);

      $panel.find('.submit').click(function() {
        var $button = $(this);//sketchy
        var response = $button.data();

        if (!response[0]) {
          $panel.find('input').each(function(i, el) {
            var $el = $(el);
            response[$el.attr('name')] = $el.val();
          });
        }

        $panel.hide();
        pM.resolve(response);

        if (self.inputRequestQueue.length === 0) {
          self.runningRequestQueue = false;
        } else {
          self._runRequestQueue();
        }
      });

      $panel.show();
    }
  };

})();