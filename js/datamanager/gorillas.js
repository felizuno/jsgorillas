(function() {
  
  App.dataManager.gameManager.gorillas = {
    children: [],
    handlers: {},

    makeSkyline: function(screenWidth, howMany) {
      var buildingWidth = screenWidth / howMany;
      var buildings = [];
      // for (var i = 0; i < howMany; i++) {
      _.each(_.range(howMany), function(v, i) {
        var height = (Math.floor(Math.random() * 300) + 100);
        var top = 1000 - height;//canvasDims.height - height;
        var left = buildingWidth * i;

        var building = new zot.rect(left, top, buildingWidth, height);
        
        // Move this to the view
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

        buildings.push(building);
      });

      this.updatePlayerPositions(buildings);
      return buildings;
    },

    updatePlayerPositions: function(skyline) {
      var positions = [];
      _.each(skyline, function(building, index) {
        if (index === 1 || index === (skyline.length - 2)) {
          var gorillaTouchWidth = 40;  // replace later
          var gorillaTouchHeight = 40; // replace later
          var gorillaTouchLeft = Math.round(building.left + ((building.width - gorillaTouchWidth) / 2));
          var gorillaTouchTop = Math.round((building.top + 14) - (gorillaTouchHeight / 2));

          var lr = (index === 1) ? 'left' : 'right';
          var img = 'img/fat-gorilla-' + lr + '.png'
          
          var gorilla = {
            who: (index > 3) ? 1 : 0, // TODO: Move this somewhere better
            img: img,
            location: new zot.rect(building.left + ((building.width / 2) - 14), (building.top - 28), 28, 28),
            touchArea: new zot.rect(gorillaTouchLeft, gorillaTouchTop, gorillaTouchWidth, gorillaTouchHeight),
            left: (index === 1)
          };

          positions.push(gorilla);

          building.gorilla = gorilla;
        }
      });

      this.sendRequestFor('player', 'all').soICan(function(players) {
        _.each(players, function(player, index) {
          player.position = positions[index];
        });
      });
    }
  };

})();
