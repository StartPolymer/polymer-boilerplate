(function (document) {
  'use strict';

  document.addEventListener('polymer-ready', function () {
    var template = document.querySelector('template[is=auto-binding]');

    template.addEventListener('template-bound', function() {
      
    });
  });

// wrap document so it plays nice with other libraries
// http://www.polymer-project.org/platform/shadow-dom.html#wrappers
})(wrap(document));
