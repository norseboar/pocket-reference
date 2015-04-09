"use strict"
// Wait for login page to render before doing anything
console.log('in popup.js');
document.addEventListener("DOMContentLoaded", function(){
  console.log('loaded');
  document.querySelector("#login_button").addEventListener("click", function(){
    var xhr = new XMLHttpRequest();
    var credentials = {
      email: document.querySelector('[name=email]').value,
      password: document.querySelector('[name=password]').value
    };
    console.log('email is ' + credentials.email + ' and password is ' +
      credentials.password);
    JSON.stringify(credentials);
    xhr.open("POST", "https://pocket-reference.herokuapp.com/api/login", true);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send(credentials);

    xhr.onreadystatechange = function(){
      console.log('in state change');
      if(xhr.readyState === 4 && xhr.status === 200){
        chrome.browserAction.setPopup({
          details: { popup: "add.html" }
        });
      }
    };
  });
});
