(function() {
  
  App.viewManager.canvasManager = {
    children: ['animator'],
    handlers: {
      canvasContext: 'getCanvasContext'
    },

    canvases:{
      bg1: {},
      bg2: {},
      fg1: {},
      fg2: {},
      fg3: {}
    },

    init: function(dims) {
      var self = this;

      _.each(this.canvases, function(v, canvasName) {
        self._makeNewCanvas({
          name: canvasName,
          width: dims.width,
          height: dims.height,
          touchable: (canvasName === 'fg3')
        });
      });
    },

    getCanvasContext: function(pM) {
      pM.resolve(this.canvases[pM.payload].ctx);
    },

    _makeNewCanvas: function(config) {
      var self = this;

      this.sendRequestFor('model', 'canvas').soICan(function(newCanvas) {
        newCanvas.init(config);
        self.canvases[config.name] = newCanvas;
      });
    }
  };

})();