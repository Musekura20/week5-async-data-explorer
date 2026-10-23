import "./style.css"
import { getProducts, getJSON } from "./api.js"

async function test() {
  const { products } = await getProducts()
  console.log("Products:", products.length, products[0])

  try {
    await getJSON("https://dummyjson.com/productz")
  } catch (err) {
    console.log("Caught:", err.message)
  }
}
test()