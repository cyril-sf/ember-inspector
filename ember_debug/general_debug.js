import PortMixin from "mixins/port_mixin";

var GeneralDebug = Ember.Object.extend(PortMixin, {
  namespace: null,

  port: Ember.computed.alias('namespace.port'),

  application: Ember.computed.alias('namespace.application'),

  promiseDebug: Ember.computed.alias('namespace.promiseDebug'),

  portNamespace: 'general',

  sendBooted: function() {
    var options = {booted: Ember.BOOTED};
    options.type = 'general:applicationBooted';
    options.from = 'inspectedWindow';
    options.applicationId = this.get('port.uniqueId');

    window.postMessage(options, [], '*');
  },

  messages: {
    getLibraries: function() {
      var libraries = arrayize(Ember.libraries);
      this.sendMessage('libraries', { libraries: libraries });
    },
    refresh: function() {
      window.location.reload();
    }
  }
});

function arrayize(enumerable) {
  return Ember.A(enumerable).map(function(item) {
    return item;
  });
}

export default GeneralDebug;
