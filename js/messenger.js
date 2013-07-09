// ADD A "FORWARD" METHOD TO ALLOW A HANDLER TO INVOKE  OTHER HANDLERS BEFORE RESOLVING
// ADD AND ERRORAT METHOD TO RETURN AN ERROR FOR LOGGING

(function() {
  window.Messages = {
    logging: false,

    setParent: function(parent) {
      this.parent = parent;
      var self = this;

      // TODO: Check if there are children
      _.each(this.children, function(childName) {
        var child = self[childName];
        _.extend(child, Messages);
        child.name = self.name + '.' + childName;
        child.setParent(self);
      });

      self.registerHandlersWith(parent);
    },

    registerHandlersWith: function(parent) {
      var self = this;
      var handlers = this.handlers || {};
      // console.log('Registering ' + this.name + '\'s handlers with ' + parent.name);
      if (!this.addressBook) { this.addressBook = {}; }
      if (!parent.addressBook) { parent.addressBook = {}; }

      _.each(handlers, function(newHandlerName, message) {
      // debugger;
        var existingAddress = self.addressBook[message];
        if (existingAddress) {
          existingAddress.concat([self, newHandlerName]);
        } else {
          self.addressBook[message] = [self, newHandlerName];
        }
      });

        //overwrites
      _.each(this.addressBook, function(handler, message) {
        parent.addressBook[message] = handler;
      });

      // console.log(this.name + ' handles ', this.addressBook);
    },

    findAddressFor: function(request) {
      return (this.addressBook[request]) ? this.addressBook[request] : this.parent.findAddressFor(request);
    },

    sendRequestFor: function(request, payload) {
      // console.log(request + ' requested');
      return this._pass(request, payload).to(this.findAddressFor(request));
    },

    announce: function(message, payload) {
      console.log(message + ' announced');
      return this._pass(message, payload).to(this.findAddressFor(message));
    },

    _pass: function(message, payload) {
      return {
        message: message,
        payload: payload || null,

        to: function(recipient) {
          recipient[0][recipient[1]](this);

          return this;
        },

        soICan: function(callback) {
          if (!callback) {
            return;
          } else if (this.promise) {
            this.promise.resolve(callback);
          } else {
            this.responseHandler = callback;
          }

          return this;
        },

        resolve: function(response) {
          if (this.responseHandler) {
            this.responseHandler(response);
          } else { 
            this.promise = $.Deferred();
            this.promise.then(function(responseHandler) {
              responseHandler(response);
            });
          }

          return this;
        }
      };
    }
  };
  
})();