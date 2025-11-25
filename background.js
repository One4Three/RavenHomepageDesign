// Background script to inject content script when extension icon is clicked
const chrome = window.chrome // Declare the chrome variable

chrome.action.onClicked.addListener((tab) => {
  // Inject CSS first
  chrome.scripting.insertCSS({
    target: { tabId: tab.id },
    files: ["content.css"],
  })

  // Then inject JavaScript
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ["content.js"],
  })
})
