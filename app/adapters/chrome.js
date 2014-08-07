import BasicAdapter from "adapters/basic";

var emberDebug = null;

export default  BasicAdapter.extend({
  name: 'chrome',

  sendMessage: function(options) {
    options = options || {};
    chrome.devtools.inspectedWindow.eval("console.log('Ember Inspector send: " + JSON.stringify(options) + "');");
    this.get('_chromePort').postMessage(options);
  },

  _chromePort: function() {
    return chrome.extension.connect();
  }.property(),

  _connect: function() {
    var self = this;
    var chromePort = this.get('_chromePort');
    chromePort.postMessage({ appId: chrome.devtools.inspectedWindow.tabId });

    chromePort.onMessage.addListener(function(message) {
      if (typeof message.type === 'string' && message.type === 'iframes') {
        sendIframes(message.urls);
      }
      self._messageReceived(message);
    });
    chrome.devtools.inspectedWindow.eval("console.warn('Ember Inspector _connect');");
    this._injectDebugger();
  }.on('init'),

  _handleReload: function() {
    var self = this;
    chrome.devtools.network.onNavigated.addListener(function() {
chrome.devtools.inspectedWindow.eval("console.warn('Ember Inspector _handleReload');");
      location.reload(true);
    });
  }.on('init'),

  _injectDebugger: function() {
    loadEmberDebug();
    chrome.devtools.inspectedWindow.eval(emberDebug);
    var urls = [];
    chrome.devtools.inspectedWindow.onResourceAdded.addListener(function(opts) {
      if (opts.type === 'document') {
        sendIframes([opts.url]);
      }
    });
    chrome.devtools.inspectedWindow.eval("console.warn('Ember Inspector _injectDebugger');");
  }
});

function sendIframes(urls) {
  loadEmberDebug();
  urls.forEach(function(url) {
    chrome.devtools.inspectedWindow.eval(emberDebug, { frameURL: url });
  });
}

function loadEmberDebug() {
  var xhr;
  if (!emberDebug) {
    xhr = new XMLHttpRequest();
    xhr.open("GET", chrome.extension.getURL('/ember_debug/ember_debug.js'), false);
    xhr.send();
    emberDebug = xhr.responseText;
    chrome.devtools.inspectedWindow.eval("console.warn('Ember Inspector loadEmberDebug');");
  }
}
