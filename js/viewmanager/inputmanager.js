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
      var pM = this.inputRequestQueue.pop();
      //sketchy
      var $panel = $('.input-panel').html(pM.payload);

      $panel.find('.submit').click(function() {
        //sketchy
        var response = $(this).data();

        if (!response) {
          response = [];

          //sketchy
          $panel.children().each(function(i, $el) {
            //sketchy
            if ($el.data().length) {
              //sketchy
              _.each($el.data(), function(value, key) {
                response[key] = value;
              });
            }
          });
        }

        $panel.hide();
        console.log(response);
        pM.resolve(response);

        if (self.inputRequestQueue.length === 0) {
          console.log(self.inputRequestQueue);
          self.runningRequestQueue = false;
        } else {
          self.runRequestQueue();
        }
      });

      $panel.show();

    }
  };

})();