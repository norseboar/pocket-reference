// Create context menu item
var id = 'pocket-reference';
// var POCKET_REFERENCE_URL = 'http://localhost:3000';

var POCKET_REFERENCE_URL = 'https://pocket-reference.herokuapp.com';
var add_url = POCKET_REFERENCE_URL + '/api/add_claim';

chrome.contextMenus.create({
  id: id,
  title: "Add '%s' to Pocket Reference",
  contexts: ["selection"]
});

chrome.contextMenus.onClicked.addListener(function(info){
  if(info.menuItemId !== id){
    return;
  }
  var claim = {
    title: info.selectionText,
    url: info.pageUrl
  };

  var xhr = new XMLHttpRequest();
  xhr.open('POST', add_url, true);
  xhr.setRequestHeader('Content-type', 'application/json');
  xhr.send(JSON.stringify(claim));

  xhr.onreadystatechange = function() {
    if(xhr.readyState === 4 && xhr.status === 200) {
      var title;
      var message;
      var url;
      var response = JSON.parse(xhr.responseText);
      if(response.status === 0) {
        title = 'Claim has been added';
        message = 'You can see all your claims at the Pocket Reference page.' +
            ' Click here to go.';
      } else {
        if(response.status === 1) {
          title = 'You\'re not logged in';
          message = 'Login through the icon in your extension bar, or' +
              ' at the home page. Click here to go.';
        } else {
          title = 'Uh oh';
          message = 'Something crashed on our end. Please try again later';
        }
      }
      var notification = chrome.notifications.create({
        type: 'basic',
        iconUrl: 'images/logo48.png',
        title: title,
        message: message
      }, function(notificationId) {
        chrome.notifications.onClicked.addListener(function(clickedId) {
          if(clickedId === notificationId) {
            chrome.tabs.create({url: POCKET_REFERENCE_URL});
          }
        })
      });
    }
  };
});
