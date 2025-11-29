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
      count: 0,
      avgPrice: "$0.00",
      listings: [
        {
          image: "placeholder-1.jpg",
          price: "$0.00",
          title: "Listing Title 1",
          url: window.location.href,
        },
        {
          image: "placeholder-2.jpg",
          price: "$0.00",
          title: "Listing Title 2",
          url: window.location.href,
        },
        {
          image: "placeholder-3.jpg",
          price: "$0.00",
          title: "Listing Title 3",
          url: window.location.href,
        },
      ],
    },
    craigslist: {
      count: 0,
      avgPrice: "$0.00",
      listings: [
        {
          image: "placeholder-1.jpg",
          price: "$0.00",
          title: "Listing Title 1",
          url: window.location.href,
        },
        {
          image: "placeholder-2.jpg",
          price: "$0.00",
          title: "Listing Title 2",
          url: window.location.href,
        },
        {
          image: "placeholder-3.jpg",
          price: "$0.00",
          title: "Listing Title 3",
          url: window.location.href,
        },
      ],
    },
    ebay: {
      count: 0,
      avgPrice: "$0.00",
      listings: [
        {
          image: "placeholder-1.jpg",
          price: "$0.00",
          title: "Listing Title 1",
          url: window.location.href,
        },
        {
          image: "placeholder-2.jpg",
          price: "$0.00",
          title: "Listing Title 2",
          url: window.location.href,
        },
        {
          image: "placeholder-3.jpg",
          price: "$0.00",
          title: "Listing Title 3",
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
            <svg class="raven-loading-bird" viewBox="0 0 120 100" xmlns="http://www.w3.org/2000/svg">
              <!-- Body -->
              <ellipse cx="60" cy="50" rx="18" ry="22" class="bird-body"/>
              
              <!-- Head and beak -->
              <circle cx="60" cy="32" r="10" class="bird-head"/>
              <path d="M68 30 L75 32 L68 34 Z" class="bird-beak"/>
              
              <!-- Eye -->
              <circle cx="63" cy="30" r="1.5" fill="#fffd71"/>
              
              <!-- Tail feathers (detailed fan) -->
              <path d="M60 70 L58 85 L60 83 Z" class="bird-tail-feather"/>
              <path d="M60 70 L60 88 L60 83 Z" class="bird-tail-feather"/>
              <path d="M60 70 L62 85 L60 83 Z" class="bird-tail-feather"/>
              
              <!-- Left wing with feather details -->
              <g class="bird-wing-left">
                <!-- Main wing shape -->
                <path d="M50 45 L25 50 L28 48 L30 50 L33 48 L35 50 L38 48 L42 50 L45 48 L48 50 Z" class="wing-main"/>
                <!-- Wing feathers (individual primaries) -->
                <path d="M25 50 L22 55 L25 52 Z" class="wing-feather"/>
                <path d="M28 48 L25 53 L28 50 Z" class="wing-feather"/>
                <path d="M33 48 L30 53 L33 50 Z" class="wing-feather"/>
                <path d="M38 48 L35 53 L38 50 Z" class="wing-feather"/>
                <path d="M42 50 L39 55 L42 52 Z" class="wing-feather"/>
              </g>
              
              <!-- Right wing with feather details -->
              <g class="bird-wing-right">
                <!-- Main wing shape -->
                <path d="M70 45 L95 50 L92 48 L90 50 L87 48 L85 50 L82 48 L78 50 L75 48 L72 50 Z" class="wing-main"/>
                <!-- Wing feathers (individual primaries) -->
                <path d="M95 50 L98 55 L95 52 Z" class="wing-feather"/>
                <path d="M92 48 L95 53 L92 50 Z" class="wing-feather"/>
                <path d="M87 48 L90 53 L87 50 Z" class="wing-feather"/>
                <path d="M82 48 L85 53 L82 50 Z" class="wing-feather"/>
                <path d="M78 50 L81 55 L78 52 Z" class="wing-feather"/>
              </g>
              
              <!-- Legs -->
              <line x1="58" y1="70" x2="56" y2="78" stroke="#1a1a1a" stroke-width="1.5"/>
              <line x1="62" y1="70" x2="64" y2="78" stroke="#1a1a1a" stroke-width="1.5"/>
            </svg>
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
