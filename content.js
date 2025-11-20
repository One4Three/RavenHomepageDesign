// Create and inject the RAVEN extension overlay
;(() => {
  // Prevent multiple injections
  if (document.getElementById("raven-extension-overlay")) {
    return
  }

  // Declare the chrome variable
  const chrome = window.chrome

  const platformData = {
    all: {
      count: 128,
      avgPrice: "$140.42",
      listings: [
        { image: "nike-matcha-1.jpg", price: "$125.00", title: "Nike SB Dunk Low 'Matcha'" },
        { image: "nike-matcha-2.jpg", price: "$159.00", title: "Nike SB Matcha" },
        { image: "nike-matcha-3.jpg", price: "$139.00", title: "Nike SB Dunks" },
      ],
    },
    craigslist: {
      count: 47,
      avgPrice: "$132.50",
      listings: [
        { image: "craigslist-1.jpg", price: "$120.00", title: "Nike Dunk Low - Barely Used" },
        { image: "craigslist-2.jpg", price: "$135.00", title: "Retro Nike Dunks Green" },
        { image: "craigslist-3.jpg", price: "$142.00", title: "Nike SB Low Top Sneakers" },
      ],
    },
    ebay: {
      count: 81,
      avgPrice: "$145.75",
      listings: [
        { image: "ebay-1.jpg", price: "$149.99", title: "Nike SB Dunk Low Matcha - Size 10" },
        { image: "ebay-2.jpg", price: "$138.00", title: "Authentic Nike SB Matcha Colorway" },
        { image: "ebay-3.jpg", price: "$155.00", title: "Nike SB Dunk Low Green/White" },
      ],
    },
  }

  // Create the overlay container
  const overlay = document.createElement("div")
  overlay.id = "raven-extension-overlay"

  overlay.innerHTML = `
    <div class="raven-header">
      <div class="raven-logo">RAVEN</div>
      <button class="raven-close" id="raven-close-btn">×</button>
    </div>

    <div class="raven-tabs">
      <button class="raven-tab active" data-tab="all">All</button>
      <button class="raven-tab" data-tab="craigslist">Craigslist</button>
      <button class="raven-tab" data-tab="ebay">Ebay</button>
    </div>

    <div class="raven-stats">
      <div class="raven-stat-card">
        <div class="raven-stat-value" id="stat-count">128</div>
        <div class="raven-stat-label">Listings Found</div>
      </div>
      <div class="raven-stat-card">
        <div class="raven-stat-value" id="stat-price">$140.42</div>
        <div class="raven-stat-label">Average Price</div>
      </div>
    </div>

    <div class="raven-section-header">
      <div class="raven-section-title">Top Listings</div>
      <button class="raven-view-all">View All Listings</button>
    </div>

    <div class="raven-listings" id="raven-listings"></div>
  `

  // Append to body
  document.body.appendChild(overlay)

  function updateListings(tab) {
    const data = platformData[tab]
    const listingsContainer = document.getElementById("raven-listings")
    const statCount = document.getElementById("stat-count")
    const statPrice = document.getElementById("stat-price")

    // Update stats
    statCount.textContent = data.count
    statPrice.textContent = data.avgPrice

    // Update listings
    listingsContainer.innerHTML = data.listings
      .map(
        (listing) => `
      <div class="raven-listing-item">
        <img src="${chrome.runtime.getURL(`images/${listing.image}`)}" alt="${listing.title}" class="raven-listing-image">
        <div class="raven-listing-info">
          <div class="raven-listing-price">${listing.price}</div>
          <div class="raven-listing-title">${listing.title}</div>
        </div>
      </div>
    `,
      )
      .join("")
  }

  // Initialize with 'all' tab
  updateListings("all")

  // Close button functionality
  document.getElementById("raven-close-btn").addEventListener("click", () => {
    overlay.remove()
  })

  const tabs = overlay.querySelectorAll(".raven-tab")
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"))
      tab.classList.add("active")

      const selectedTab = tab.getAttribute("data-tab")
      updateListings(selectedTab)
    })
  })

  // View All button functionality
  overlay.querySelector(".raven-view-all").addEventListener("click", () => {
    console.log("[v0] View all listings clicked")
    // Add functionality to show all listings
  })
})()
