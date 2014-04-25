(function() {
  
  App.viewManager.canvasManager.animator = {
    children: [],
    handlers: {
      draw: 'queueFrame'
    },

    animFrameQueue: [],
    runningFameQueue: false,

    queueFrame: function(pM) {
      this.animFrameQueue.push(pM.payload);
      if (!this.runningFameQueue) {
        this._runFrameQueue();
      }
    },

    _runFrameQueue: function() {
      var self = this;

      this.runningFameQueue = true;

      var runQueue = function() {
        _.each(self.animFrameQueue, function(frameFunc) {
// console.log('frame', frameFunc);
          frameFunc();
        });
      };

      requestAnimationFrame(runQueue);

      this.runningFameQueue = false;
    }
  };

})();
