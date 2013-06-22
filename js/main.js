(function() {
  window.App = {
    name: 'App',
    children: ['dataManager', 'viewManager'],
    init: function() {
      var self = this;
      _.extend(this, Messages);

      _.each(this.children, function(childName) {
        var child = self[childName];
        _.extend(child, Messages);
        child.name = self.name + '.' + childName;
        child.setParent(self);
        child.init();
      });

      this.announce('greetHumans');
    },

    findAddressFor: function(request) {
      // App knows all the registered handlers
      return (this.addressBook[request]) ? this.addressBook[request] : 'fuct';
    }
  };

  $(document).ready(function() {
    App.init();
  });
})();