"use strict";

(function($){
  var POCKET_REFERENCE_URL = 'https://pocket-reference.herokuapp.com';

  document.getElementById('add-claim').addEventListener('click',
      function() {
    var xhr = new XMLHttpRequest();
    var claim = {
      title: document.getElementById('title').value,
      url: document.getElementById('url').value
    };
    xhr.open('POST', POCKET_REFERENCE_URL + '/api/add_claim');
    xhr.setRequestHeader('Content-type', 'application/json');
    xhr.send(JSON.stringify(claim));
    xhr.onreadystatechange = function() {
      if(xhr.readyState === 4 && xhr.status === 200) {
        location.reload();
      }
    }
  });
})(jQuery);
