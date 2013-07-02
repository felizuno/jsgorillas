(function() {
  
  App.dataManager.gameManager.gorillas = {
    makeSkyline: function(screenWidth, howMany) {
      var buildingWidth = screenWidth / howMany;
      var buildings = [];
      for (var i = 0; i < howMany; i++) {
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

        var gorillaWidth = 28;  // replace later
        var gorillaHeight = 28; // replace later
        var gorillaLeft = Math.round(building.left + ((building.width - gorillaWidth) / 2));
        var gorillaTop = Math.round(building.top - gorillaHeight);

        if (howMany > 3) {
          // TODO: Accomodate more than 2 players
          if (i === 1 || i === (howMany - 2)) {
            building.gorilla = 'img/gorilla-left.png';
            // PLAYERS HAVE AN UPDATEPOSITION METHOD... USE IT
            // this.addPlayerPosition(new zot.rect(gorillaLeft, gorillaTop, gorillaWidth, gorillaHeight));
          }
        } else { // howMany = 3 (< 3 not allowed up top)
          if (i === 0 || i === 2) {
            building.gorilla = 'img/gorilla-left.png';
            // PLAYERS HAVE AN UPDATEPOSITION METHOD... USE IT
            // this.addPlayerPosition(new zot.rect(gorillaLeft, gorillaTop, gorillaWidth, gorillaHeight));
          }
        }

        buildings.push(building);
      }

      return buildings;
    }
  };

})();
