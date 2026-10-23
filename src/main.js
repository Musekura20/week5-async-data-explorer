import "./style.css"
import { getProducts, getCategories, getProduct } from "./api.js"
import { render, renderDetails, renderDetailsMessage } from "./render.js"

const state = {
  items: [],
  categories: [],
  status: "loading",
  error: null,
  query: "",
  filter: "all",
  sort: "default",
}

async function load() {
  state.status = "loading"
  state.error = null
  render(state)

  try {
    const [productsResult, categoriesResult] = await Promise.allSettled([
      getProducts(),
      getCategories(),
    ])

    if (productsResult.status === "rejected") throw productsResult.reason

    state.items = productsResult.value.products
    state.categories =
      categoriesResult.status === "fulfilled" ? categoriesResult.value : []
    state.status = "success"
  } catch (err) {
    state.status = "error"
    state.error = err.message
  } finally {
    render(state)
  }
}

const detailsEl = document.querySelector("#details")

async function openDetails(id) {
  renderDetailsMessage("Loading details...")
  detailsEl.showModal()
  try {
    renderDetails(await getProduct(id))
  } catch (err) {
    renderDetailsMessage(`Could not load details: ${err.message}`)
  }
}

document.querySelector("#grid").addEventListener("click", (event) => {
  if (event.target.closest("#retry")) return load()
  const card = event.target.closest("button[data-id]")
  if (card) openDetails(card.dataset.id)
})

document.querySelector("#close-details").addEventListener("click", () => detailsEl.close())

let timer
document.querySelector("#search").addEventListener("input", (event) => {
  clearTimeout(timer)
  timer = setTimeout(() => {
    state.query = event.target.value
    render(state)
  }, 300)
})

document.querySelector("#category").addEventListener("change", (event) => {
  state.filter = event.target.value
  render(state)
})

document.querySelector("#sort").addEventListener("change", (event) => {
  state.sort = event.target.value
  render(state)
})

load()