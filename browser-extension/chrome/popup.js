"use strict"
// Wait for login page to render before doing anything
document.addEventListener("DOMContentLoaded", function(){
  var POCKET_REFERENCE_URL = 'https://pocket-reference.herokuapp.com';
  var postObject = function(xhr, url, obj) {
    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-type', 'application/json');
    xhr.send(JSON.stringify(obj));
  }

  // Switch from the login page to the add page
  var showAdd = function() {
    document.getElementById('login').style.display = 'none';
    document.getElementById('add').style.display = 'initial';
  }

  // Switch from main page to login page
  var showLogin = function() {
    document.getElementById('add').style.display = 'none';
    document.getElementById('login').style.display = 'initial';
  }

  // Check if user already has a session cookies
  // Timeout after a second, and just show them login page
  var xhr = new XMLHttpRequest();
  xhr.timeout = 1000;
  xhr.ontimeout = function() {
    showLogin();
  };
  postObject(xhr, POCKET_REFERENCE_URL + '/api/login', {});
  xhr.onreadystatechange = function() {
    if(xhr.readyState === 4 && xhr.status === 200) {
      var response = JSON.parse(xhr.responseText);
      if(response.status === 0) {
        showAdd();
      }
      else {
        showLogin();
      }
    }
  }

  document.getElementById('login-button').addEventListener('click',
      function() {
    var xhr = new XMLHttpRequest();
    var credentials = {
      email: document.querySelector('[name=email]').value,
      password: document.querySelector('[name=password]').value
    };
    postObject(xhr, POCKET_REFERENCE_URL + '/api/login', credentials);

    xhr.onreadystatechange = function(){
      if(xhr.readyState === 4 && xhr.status === 200){
        showAdd();
      }
    };
  });

  document.getElementById('add-button').addEventListener('click', function() {
    var xhr = new XMLHttpRequest();
    var titleElem = document.getElementById('title');
    var urlElem = document.getElementById('url');
    var claim = {
      title: titleElem.value,
      url: urlElem.value
    };
    postObject(xhr, POCKET_REFERENCE_URL + '/api/add_claim', claim);
    xhr.onreadystatechange = function() {
      if(xhr.readyState === 4 && xhr.status === 200) {
        titleElem.value = '';
        urlElem.value = '';
        var response = JSON.parse(xhr.responseText);
        if(response.status === 1) {
          // TODO: error message that it didn't go through
          showLogin();
        }
      }
    };
  });
});
