(function() {
  
  App.viewManager.canvasManager.animator = {
    children: [],
    handlers: {},
    renderSky: function() {
      this.sendRequestFor('canvasContext', 'sky').soICan(function(ctx) {
        ctx.fillStyle = 'lightblue';
        ctx.fillRect(0, 0, 1000, 1000);
      });
    }
  };

})();
