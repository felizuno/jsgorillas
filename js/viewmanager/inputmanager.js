(function() {
  
  App.viewManager.inputManager = {
    touchTargets: [],
    touchTracker: [],
    inputRequestQueue: [],
    handlers: {
      makeTouchable: 'enableTouchInput',
      registerTouchTarget: 'addTouchTarget',
      unregisterTouchTarget: 'removeTouchTarget',
      touchTargets: 'getTouchTargets',
      input: 'queueInputRequest'      
    },

    enableTouchInput: function(pM) {
      if (!pM.payload.touchable) {
        pM.payload.$el.on('touchstart', this.processTouchStart);
        pM.payload.$el.on('touchend', this.processTouchEnd);

        pM.payload.touchable = true;
      }

      pM.resolve(pM.payload); // TODO: empty resolve should use payload instead of doing this
    },

    addTouchTarget: function(pM) {
      // pM.payload should be a zot.rect
    },

    removeTouchTarget: function(pM) {
      
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
        var zotRect = new zot.rect(touch.screenX - 20, touch.screenY - 20, 40, 40); // TODO: Build the rect to represent the cussioned touch
    
        _.each(self.touchTargets, function(target) {
          if (zotRect.intersects(target.where)) {
            console.log('Gorilla!!!', target.where);
            touch.time = Date.now();
            self.touchTracker.push(touch);
            return;
          }
        });
      });
    },

    processTouchEnd: function(origEvent) {
      var e = origEvent.originalEvent.changedTouches[0]; // IS IT REALLY ALWAYS JUST THE ONE?

      var valid = _.find(this.touchTracker, function(touch) {
        return touch.identifier === e.identifier;
      });

      if (valid) {
        var deltaX = e.screenX - valid.screenX;
        var deltaY = e.screenY - valid.screenY;
        var deltaT = (Date.now - valid.time); // * 0.001;

        var theta = Math.atan(deltaY / deltaX);
        console.log('Theta', theta);
        var velocity = (Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2)) / 5); // Magic Number 5

        // return {
        //   theta: theta,
        //   velocity: velocity,
        //   origin: [this.x0, this.top]
        // };
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