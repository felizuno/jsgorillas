(function() {
  
  App.viewManager.canvasManager = {
    children: ['animator'],
    handlers: {
      canvasContext: 'getCanvasContext'
    },

    canvases:{
      sky: {},
      fg1: {},
      fg2: {},
      decoration: {}
    },

    init: function(dims) {
      var self = this;

      _.each(this.canvases, function(v, canvasName) {
        self._makeNewCanvas({
          name: canvasName,
          width: dims.width,
          height: dims.height,
          touchable: (canvasName === 'decoration')
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