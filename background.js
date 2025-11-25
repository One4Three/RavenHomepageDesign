// Import the chrome variable
const chrome = require("chrome")

chrome.action.onClicked.addListener(async (tab) => {
  try {
    console.log("[v0] Extension icon clicked, injecting on tab:", tab.id)

    // Inject CSS first
    await chrome.scripting.insertCSS({
      target: { tabId: tab.id },
      files: ["content.css"],
    })

    console.log("[v0] CSS injected successfully")

    // Then inject JavaScript
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["content.js"],
    })

    console.log("[v0] JavaScript injected successfully")
  } catch (error) {
    console.error("[v0] Error injecting content script:", error)
  }
})
