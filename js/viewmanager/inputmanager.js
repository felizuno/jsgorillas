(function() {
  
  App.viewManager.inputManager = {
    inputRequestQueue: [],
    handlers: {
      input: 'queueInputRequest'      
    },  

    queueInputRequest: function(pM) {
      this.inputRequestQueue.push(pM);

      if (!this.runningRequestQueue) {
        this.runRequestQueue();
      }
    },

    runRequestQueue: function() {
      this.runningRequestQueue = true;
      var self = this;
      var pM = this.inputRequestQueue.shift();
      //sketchy
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
        console.log(response, self.inputRequestQueue);
        pM.resolve(response);

        if (self.inputRequestQueue.length === 0) {
          self.runningRequestQueue = false;
        } else {
          // console.log(self.inputRequestQueue);
          self.runRequestQueue();
        }
      });

      $panel.show();
    }
  };

})();