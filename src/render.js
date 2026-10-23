import { escapeHTML, getVisibleItems } from "./utils.js"

const statusEl = document.querySelector("#status")
const gridEl = document.querySelector("#grid")
const categoryEl = document.querySelector("#category")

const skeletonCard = `
  <div class="animate-pulse rounded-lg bg-white p-4 shadow">
    <div class="h-40 rounded bg-slate-200"></div>
    <div class="mt-3 h-3 w-1/3 rounded bg-slate-200"></div>
    <div class="mt-2 h-4 w-3/4 rounded bg-slate-200"></div>
    <div class="mt-2 h-4 w-1/4 rounded bg-slate-200"></div>
  </div>`

function renderSkeleton() {
  gridEl.innerHTML = Array.from({ length: 8 }, () => skeletonCard).join("")
}

function renderError(message) {
  gridEl.innerHTML = `
    <div class="col-span-full rounded-lg border border-red-200 bg-red-50 p-6 text-center">
      <p class="font-semibold text-red-700">Oops! We could not load the products.</p>
      <p class="mt-1 text-sm text-red-600">${escapeHTML(message)}</p>
      <button id="retry" type="button"
        class="mt-4 rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700">Retry</button>
    </div>`
}

function renderCards(items) {
  gridEl.innerHTML = items
    .map(({ id, title, price, category, thumbnail, rating }) => {
      const priceText = price != null ? `$${price.toFixed(2)}` : "Price not available"
      return `
        <button type="button" data-id="${escapeHTML(id)}"
          class="rounded-lg bg-white p-4 text-left shadow hover:shadow-lg focus:outline focus:outline-2 focus:outline-slate-900">
          <img src="${escapeHTML(thumbnail ?? "")}" alt="${escapeHTML(title ?? "Product image")}"
            class="h-40 w-full object-contain" loading="lazy" />
          <span class="mt-2 block text-xs uppercase text-slate-500">${escapeHTML(category ?? "Unknown")}</span>
          <span class="block font-semibold">${escapeHTML(title ?? "Untitled")}</span>
          <span class="mt-1 block font-bold">${escapeHTML(priceText)}</span>
          <span class="block text-sm text-slate-600">Rating: ${escapeHTML(rating ?? "N/A")}</span>
        </button>`
    })
    .join("")
}

function renderEmpty() {
  gridEl.innerHTML = `
    <div class="col-span-full rounded-lg bg-white p-6 text-center shadow">
      <p class="font-semibold">No products match your search.</p>
      <p class="mt-1 text-sm text-slate-600">Try another word or choose "All categories".</p>
    </div>`
}

function renderCategoryOptions({ categories, items }) {
  if (categoryEl.options.length > 1) return // already built

  const names = categories.length
    ? categories
    : [...new Set(items.map(({ category }) => category))]

  names.forEach((name) => {
    const option = document.createElement("option")
    option.value = name
    option.textContent = name
    categoryEl.append(option)
  })
}

export function render(state) {
  const { status, error } = state

  if (status === "loading") {
    statusEl.textContent = "Loading products..."
    renderSkeleton()
  }

  if (status === "error") {
    statusEl.textContent = "Something went wrong."
    renderError(error)
  }

  if (status === "success") {
    renderCategoryOptions(state)
    const visible = getVisibleItems(state)

    if (visible.length === 0) {
      statusEl.textContent = "No products found."
      renderEmpty()
    } else {
      statusEl.textContent = `${visible.length} products found`
      renderCards(visible)
    }
  }
}