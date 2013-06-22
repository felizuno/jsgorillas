(function() {
  
  App.dataManager.modelManager = {
    children: [],
    models: {},
    handlers: {
      model: 'newModel'
    },
    
    newModel: function(pM) {
      if (this.models[pM.payload]) {
        pM.resolve(new this.models[pM.payload]);
      } else {
        // pm.errorAt(this.name, pM, this));
      }
    },
  };

})();