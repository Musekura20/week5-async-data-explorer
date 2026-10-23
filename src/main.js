import "./style.css"
import { getProducts, getCategories } from "./api.js"
import { render } from "./render.js"

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

document.querySelector("#grid").addEventListener("click", (event) => {
  if (event.target.closest("#retry")) load()
})

load()