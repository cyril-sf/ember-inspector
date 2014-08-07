import BasicAdapter from "adapters/basic";

var ChromeAdapter = BasicAdapter.extend({
  sendMessage: function(options) {
    var chromePort = this.get('_chromePort');
    options = options || {};
    if( chromePort ) {
      chromePort.postMessage(options);
    }
  },

  inspectElement: function(elem) {
    inspect(elem);
  },

  _chromePort: null,

  _connect: Ember.on('init', function() {
    var self = this;

    console.warn('Ember Debug _connect');

    function messageHandler( event ) {
console.warn('Ember Debug receives message', event.data);
      if( event.data.EmberExtensionPort ) {
console.warn('Ember Debug receives MessagePort');
        var chromePort = event.ports[0];
        self.set('_chromePort', chromePort);

        chromePort.addEventListener('message', function(event) {
          var message = event.data;
          console.log('Ember Debug receives: ' + JSON.stringify(message));
          Ember.run(function() {
            self._messageReceived(message);
          });
        });

        chromePort.start();

        //don't remove the listener. Ember Inspector will send a new port when being reactivated.
      }
    }

    window.addEventListener('message', messageHandler);
  })
});

export default ChromeAdapter;
