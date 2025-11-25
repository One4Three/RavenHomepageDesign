// Declare the chrome variable
const chrome = window.chrome

chrome.action.onClicked.addListener(async (tab) => {
  console.log("[v0] Extension icon clicked on tab:", tab.id)

  try {
    // Inject CSS first
    await chrome.scripting.insertCSS({
      target: { tabId: tab.id },
      files: ["content.css"],
    })

    console.log("[v0] CSS injected")

    // Then inject JavaScript
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["content.js"],
    })

    console.log("[v0] JavaScript injected")
  } catch (error) {
    console.error("[v0] Injection error:", error)
  }
})
