(function() {

  var module = App.dataManager.modelManager.models.Game = function() {
    this.buildingCount = 14;
    this.pastRounds = [];
  };

  module.prototype = {
    init: function(zotRect) {
      this.screenSize = zotRect;
    },

    newRound: function(round) {
      if (this.currentRound) { this.pastRounds.push(this.currentRound); }

      this.currentRound = round;
    }
  };

})();