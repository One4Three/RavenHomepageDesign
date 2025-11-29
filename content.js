;(() => {
  let overlay = null
  let currentTab = "all"
  let currentView = "list"
  let selectedListing = null
  let isLoading = false

  const url = window.location.href
  const isMarketplace = url.includes("facebook.com/marketplace/item/")
  const isCraigslist = url.includes("craigslist.org")
  const isEbay = url.includes("ebay.com")

  const platformData = {
    all: {
      count: 128,
      avgPrice: "$140.42",
      listings: [
        {
          image: "nike-matcha-1.jpg",
          price: "$125.00",
          title: "Nike SB Dunk Low 'Matcha'",
          url: window.location.href,
        },
        {
          image: "nike-matcha-2.jpg",
          price: "$159.00",
          title: "Nike SB Matcha",
          url: window.location.href,
        },
        {
          image: "nike-matcha-3.jpg",
          price: "$139.00",
          title: "Nike SB Dunks",
          url: window.location.href,
        },
      ],
    },
    craigslist: {
      count: 47,
      avgPrice: "$132.50",
      listings: [
        {
          image: "craigslist-1.jpg",
          price: "$120.00",
          title: "Nike Dunk Low - Barely Used",
          url: window.location.href,
        },
        {
          image: "craigslist-2.jpg",
          price: "$135.00",
          title: "Retro Nike Dunks Green",
          url: window.location.href,
        },
        {
          image: "craigslist-3.jpg",
          price: "$142.00",
          title: "Nike SB Low Top Sneakers",
          url: window.location.href,
        },
      ],
    },
    ebay: {
      count: 81,
      avgPrice: "$145.75",
      listings: [
        {
          image: "ebay-1.jpg",
          price: "$149.99",
          title: "Nike SB Dunk Low Matcha - Size 10",
          url: window.location.href,
        },
        {
          image: "ebay-2.jpg",
          price: "$138.00",
          title: "Authentic Nike SB Matcha Colorway",
          url: window.location.href,
        },
        {
          image: "ebay-3.jpg",
          price: "$155.00",
          title: "Nike SB Dunk Low Green/White",
          url: window.location.href,
        },
      ],
    },
  }

  function shouldShowExtension() {
    const url = window.location.href
    const isMarketplace = url.includes("facebook.com/marketplace/item/")
    const isCraigslist = url.includes("craigslist.org")
    const isEbay = url.includes("ebay.com")
    return isMarketplace || isCraigslist || isEbay
  }

  function showLoadingScreen() {
    if (!overlay) {
      overlay = document.createElement("div")
      overlay.id = "raven-extension-overlay"
      document.body.appendChild(overlay)
    }

    // Extract product title from page
    const pageTitle = document.title || "listings"

    overlay.innerHTML = `
      <div class="raven-loading-screen">
        <div class="raven-header">
          <img src="${window.chrome.runtime.getURL("images/raven-logo.png")}" alt="RAVEN" class="raven-logo-img">
          <button class="raven-close" id="raven-loading-close-btn">×</button>
        </div>
        <div class="raven-loading-content">
          <div class="raven-loading-bird-container">
            <img src="${window.chrome.runtime.getURL("images/flying-bird.gif")}" alt="Flying Bird" class="raven-loading-bird-gif">
            <div class="raven-loading-gradient"></div>
          </div>
          <div class="raven-loading-text">
            <div class="raven-loading-label">Searching for</div>
            <div class="raven-loading-title">${pageTitle}</div>
          </div>
        </div>
      </div>
    `

    document.getElementById("raven-loading-close-btn").addEventListener("click", () => {
      if (overlay) {
        overlay.remove()
        overlay = null
      }
    })

    isLoading = true
  }

  function showContent() {
    isLoading = false
    renderListView()
  }

  function initExtension() {
    console.log("[v0] Checking URL:", window.location.href)

    if (!shouldShowExtension()) {
      console.log("[v0] Not on a listing page, hiding extension")
      if (overlay) {
        overlay.remove()
        overlay = null
      }
      return
    }

    // Remove existing overlay if present
    if (overlay) {
      console.log("[v0] Removing existing overlay")
      overlay.remove()
      overlay = null
    }

    console.log("[v0] Creating RAVEN overlay")

    // Create overlay
    overlay = document.createElement("div")
    overlay.id = "raven-extension-overlay"
    document.body.appendChild(overlay)

    // Show loading screen
    showLoadingScreen()

    // Simulate backend API call (replace with your actual backend call)
    setTimeout(() => {
      showContent()
    }, 5000)
  }

  function renderListView() {
    overlay.innerHTML = `
      <div class="raven-header">
        <img src="${window.chrome.runtime.getURL("images/raven-logo.png")}" alt="RAVEN" class="raven-logo-img">
        <button class="raven-close" id="raven-close-btn">×</button>
      </div>

      <div class="raven-tabs">
        <button class="raven-tab ${currentTab === "all" ? "active" : ""}" data-tab="all">All</button>
        <button class="raven-tab ${currentTab === "craigslist" ? "active" : ""}" data-tab="craigslist">Craigslist</button>
        <button class="raven-tab ${currentTab === "ebay" ? "active" : ""}" data-tab="ebay">Ebay</button>
      </div>

      <div class="raven-stats">
        <div class="raven-stat-card">
          <div class="raven-stat-value" id="stat-count">${platformData[currentTab].count}</div>
          <div class="raven-stat-label">Listings Found</div>
        </div>
        <div class="raven-stat-card">
          <div class="raven-stat-value" id="stat-price">${platformData[currentTab].avgPrice}</div>
          <div class="raven-stat-label">Average Price</div>
        </div>
      </div>

      <div class="raven-section-header">
        <div class="raven-section-title">Top Listings</div>
        <button class="raven-view-all">View All Listings</button>
      </div>

      <div class="raven-listings" id="raven-listings">
        ${platformData[currentTab].listings
          .map(
            (listing, index) => `
          <div class="raven-listing-item" data-index="${index}">
            <img src="${window.chrome.runtime.getURL(`images/${listing.image}`)}" alt="${listing.title}" class="raven-listing-image">
            <div class="raven-listing-info">
              <div class="raven-listing-price">${listing.price}</div>
              <div class="raven-listing-title">${listing.title}</div>
            </div>
          </div>
        `,
          )
          .join("")}
      </div>
    `
    attachListViewEventListeners()
  }

  function renderDetailView(listing) {
    overlay.innerHTML = `
      <div class="raven-header">
        <img src="${window.chrome.runtime.getURL("images/raven-logo.png")}" alt="RAVEN" class="raven-logo-img">
        <button class="raven-close" id="raven-close-btn">×</button>
      </div>

      <div class="raven-detail-view">
        <button class="raven-back-btn" id="raven-back-btn">
          <span>←</span> ${currentTab.charAt(0).toUpperCase() + currentTab.slice(1)}
        </button>
        
        <div class="raven-detail-image-container">
          <img src="${window.chrome.runtime.getURL(`images/${listing.image}`)}" alt="${listing.title}" class="raven-detail-image">
        </div>

        <div class="raven-detail-info">
          <div class="raven-detail-price">${listing.price}</div>
          <div class="raven-detail-title">${listing.title}</div>
          <button class="raven-listing-page-btn" id="raven-listing-page-btn">Listing Page</button>
        </div>

        <div class="raven-stats">
          <div class="raven-stat-card">
            <div class="raven-stat-value">${platformData[currentTab].count}</div>
            <div class="raven-stat-label">Listings Found</div>
          </div>
          <div class="raven-stat-card">
            <div class="raven-stat-value">${platformData[currentTab].avgPrice}</div>
            <div class="raven-stat-label">Average Price</div>
          </div>
        </div>
      </div>
    `
    attachDetailViewEventListeners(listing)
  }

  function attachListViewEventListeners() {
    document.getElementById("raven-close-btn").addEventListener("click", () => {
      overlay.remove()
    })

    const tabs = overlay.querySelectorAll(".raven-tab")
    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        currentTab = tab.getAttribute("data-tab")
        renderListView()
      })
    })

    const listingItems = overlay.querySelectorAll(".raven-listing-item")
    listingItems.forEach((item) => {
      item.addEventListener("click", () => {
        const index = Number.parseInt(item.getAttribute("data-index"))
        selectedListing = platformData[currentTab].listings[index]
        currentView = "detail"
        renderDetailView(selectedListing)
      })
    })

    overlay.querySelector(".raven-view-all").addEventListener("click", () => {
      console.log("[v0] View all listings clicked")
    })
  }

  function attachDetailViewEventListeners(listing) {
    document.getElementById("raven-close-btn").addEventListener("click", () => {
      overlay.remove()
    })

    document.getElementById("raven-back-btn").addEventListener("click", () => {
      currentView = "list"
      renderListView()
    })

    document.getElementById("raven-listing-page-btn").addEventListener("click", () => {
      window.open(listing.url, "_blank")
    })
  }

  let lastUrl = window.location.href
  const urlObserver = new MutationObserver(() => {
    const currentUrl = window.location.href
    if (currentUrl !== lastUrl) {
      console.log("[v0] URL changed from", lastUrl, "to", currentUrl)
      lastUrl = currentUrl
      initExtension()
    }
  })

  // Start observing for URL changes
  urlObserver.observe(document.body, {
    childList: true,
    subtree: true,
  })

  // Initial load
  initExtension()
})()
