"use strict"
// Wait for login page to render before doing anything
document.addEventListener("DOMContentLoaded", function(){
  var postObject = function(xhr, url, obj) {
    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-type', 'application/json');
    xhr.send(JSON.stringify(obj));
  }
  document.getElementById('login-button').addEventListener('click',
      function() {
    var xhr = new XMLHttpRequest();
    var credentials = {
      email: document.querySelector('[name=email]').value,
      password: document.querySelector('[name=password]').value
    };
    postObject(xhr, 'http://localhost:3000/api/login', credentials);

    xhr.onreadystatechange = function(){
      if(xhr.readyState === 4 && xhr.status === 200){
        document.getElementById('login').style.display = 'none';
        document.getElementById('add').style.display = 'initial';
      }
    };
  });
  document.getElementById('add-button').addEventListener('click', function() {
    var xhr = new XMLHttpRequest();
    var claim = {
      title: document.getElementById('title').value,
      url: document.getElementById('url').value
    };
    postObject(xhr, 'http://localhost:3000/api/add_claim', claim);
    xhr.onreadystatechange = function() {
      if(xhr.readyState === 4 && xhr.status === 200) {

      }
    };
  });
});
