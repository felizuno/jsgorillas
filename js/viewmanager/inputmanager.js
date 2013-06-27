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
        pM.resolve(response);
      });

      $panel.show();

      if (!this.inputRequestQueue.length) {
        this.runningRequestQueue = false;
      } else {
        this.runRequestQueue();
      }
    }
  };

})();