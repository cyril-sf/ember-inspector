(function() {

  "use strict";

  var mc = new MessageChannel(),
      emberExtensionPort = mc.port1,
      emberDebugPort = mc.port2;

  listenToPort(emberExtensionPort);

  function messageHandler( event ) {
window.console.warn('Content script receives message');
    if ( event.data.type === 'general:applicationBooted' ) {
window.console.warn('Content script receives Ember Debug booted');
      // Ember Debug initialized
      window.postMessage({EmberExtensionPort: true}, [ emberDebugPort ], '*');
      // Propagate the event
      chrome.extension.sendMessage(event.data);

      window.removeEventListener('message', messageHandler);
    }
  }

  window.console.warn('Content script load');
  window.addEventListener('message', messageHandler);

  function listenToPort(port) {
    port.addEventListener('message', function(event) {
      chrome.extension.sendMessage(event.data);
    });

    chrome.extension.onMessage.addListener(function(message) {
      if (message.from === 'devtools') {
        port.postMessage(message);
      }
    });

    port.start();
  }

  // let ember-debug know that content script has executed
  document.documentElement.dataset.emberExtension = 1;


  // clear a possible previous Ember icon
  chrome.extension.sendMessage({ type: 'resetEmberIcon' });

  // inject JS into the page to check for an app on domready
  var script = document.createElement('script');
  script.type = "text/javascript";
  script.src = chrome.extension.getURL("in-page-script.js");
  if (document.body) document.body.appendChild(script);

  var iframes = document.getElementsByTagName('iframe');
  var urls = [];
  for (var i = 0, l = iframes.length; i < l; i ++) {
    urls.push(iframes[i].src);
  }

  // FIXME
  setTimeout(function() {
    chrome.extension.sendMessage({type: 'iframes', urls: urls});
  }, 500);


}());
