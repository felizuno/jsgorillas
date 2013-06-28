(function() {

  var module = App.dataManager.modelManager.models.Game = function() {
    this.buildingCount = 14;
  };

  module.prototype = {
    init: function(zotRect) {
      this.screenSize = zotRect;
    }
  };

})();