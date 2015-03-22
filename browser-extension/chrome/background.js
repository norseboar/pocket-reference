// Create context menu item
var id = 'pocket-reference';
var add_url = 'http://'
chrome.contextMenus.create({
  id: id,
  title: "Add '%s' to Pocket Reference",
  contexts: ["selection"],
});

chrome.contextMenus.onClicked.addListener(function(info){
  if(info.menuItemId !== id){
    return;
  }

  // Send selection text to mongoDB

});
