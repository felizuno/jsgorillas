(function() {

  App.dataManager.modelManager.models.Game = Backbone.Model.extend({
    initialize: function(howMany) {
      if (howMany < 3) {
        howMany = 3;
      }

      var canvasDims = Utils.captureCanvasProps();
      this.makeSkyline(canvasDims, howMany);
    },

    makeSkyline: function(canvasDims, howMany) {
      var buildingWidth = canvasDims.width / howMany;

      var buildings = [];
      for(var i =0; i <= howMany; i++) {
        var height = (Math.floor(Math.random() * 300) + 100);
        var top = canvasDims.height - height;
        var left = buildingWidth * i;

        var building = new zot.rect(left, top, buildingWidth, height);
        
        if (i % 3 === 0) {
          building.color = 'teal';
        } else if (i % 5 === 0) {
          building.color = 'green';
        } else {
          building.color = 'plum';
        }

        building.windows = [];
        var xInc = ((buildingWidth / 5) - 5);
        var yInc = 22; // (building.height / 8);
        var xStop = (left + buildingWidth - xInc);
        var yStop = (top + height - yInc);

        for (var yPos = (top + yInc); yPos < yStop; yPos += yInc) {
          for (var xPos = (left + xInc); xPos < xStop; xPos += xInc) {
            w = new zot.rect(xPos, yPos, 5, 10);
            building.windows.push(w);
          }
        }

        if (howMany > 3) {
          if (i === 1) {
            building.gorilla = 'img/gorilla-left.png';
          } else if (i === (howMany - 2)) {
            building.gorilla = 'img/gorilla-right.png';
          }
        } else { // howMany = 3 (< 3 not allowed up top)
          if (i === 0) {
            building.gorilla = 'img/gorilla-left.png';
          } else if (i === 2) {
            building.gorilla = 'img/gorilla-right.png';
          }
        }

        buildings.push(building);
      }

      this.set('config', {
        buildingWidth: buildingWidth,
        skyline: buildings,
        _canvasDims: canvasDims
      });
    }
  });

})();