(function() {

  var module = App.dataManager.modelManager.models.canvas = function() {};

  module.prototype = {
    init: function(config) {
      this.$el = $('<canvas>')
        .addClass(config.name)
        .prop('width', config.width)
        .prop('height', config.height)
        .appendTo('.game-view');

      this.ctx = this.$el[0].getContext('2d');
    }
  };
})();
