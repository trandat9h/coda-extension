chrome.runtime.onInstalled.addListener(() => {
    console.log('Extension installed');
  });
  
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getCurrentPageCanvasId') {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        sendResponse({ parentPageUrl: tabs[0].url })
      });
    }
    return true;
  });
  
  function readHTMLL() {
    return document.documentElement.outerHTML;
  }
  

  function getCurrentPageCanvasId () {
    // Find the first <link> tag with "/fui-canvas" in its href attribute
    var link = document.querySelector('link[href*="/fui-canvas"]');

    // Check if a matching link is found
    if (link) {
        // Extract and log the href attribute of the first found link
        var canvasUrl = link.getAttribute('href').toString();
        console.log("Found link with /fui-canvas:", canvasUrl);
    } else {
        console.log("No link with /fui-canvas found");
    }

    // Define a regular expression pattern
    const pattern = /\/fui-(.*?)\?/;

    // Use the match() method to extract the substring
    const matchResult = canvasUrl.match(pattern);

    // Check if there is a match and extract the substring
    let canvasId;
    if (matchResult && matchResult.length >= 2) {
      canvasId = matchResult[1];
      console.log("Extracted ID:", canvasId);
    } else {
      console.log("No match found");
    }
    
    // Use regex to extract canvas-id
    return canvasId
}