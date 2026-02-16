import { useEffect, useState } from 'react'

interface Product {
  id: number;
  title: string;
  price: number;
  seller_id: number;
}

function App() {
  const [apiMessage, setApiMessage] = useState<string>("Connecting to Engine...")
  const [products, setProducts] = useState<Product[]>([])

  // NEW: State for our form inputs
  const [newTitle, setNewTitle] = useState("")
  const [newPrice, setNewPrice] = useState("")

  useEffect(() => {
    fetch('/api/')
      .then(res => res.json())
      .then(data => setApiMessage(data.message))
      .catch(() => setApiMessage("Backend Offline"))

    fetch('/api/products')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error("Error fetching products:", err))
  }, [])

  // NEW: The function that runs when you hit "Submit"
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault() // Stops the page from refreshing

    const response = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: newTitle,
        price: parseFloat(newPrice) // Convert the string input to a decimal number
      })
    })

    if (response.ok) {
      const addedProduct = await response.json()
      // Instantly update the screen with the new product without refreshing the page!
      setProducts([...products, addedProduct])
      // Clear the form boxes
      setNewTitle("")
      setNewPrice("")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-20">
      {/* NAVIGATION BAR */}
      <nav className="bg-white shadow-sm px-8 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Docker<span className="text-blue-600">Mart</span></h1>
        <div className="flex items-center space-x-4">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${apiMessage === "Backend Offline" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
            Engine: {apiMessage}
          </span>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Welcome to the Future of Commerce</h2>
        </div>

        {/* NEW: ADD PRODUCT FORM */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-12 max-w-2xl mx-auto">
          <h3 className="font-bold text-lg mb-4 text-gray-900">List a New Product</h3>
          <form onSubmit={handleAddProduct} className="flex space-x-4">
            <input
              type="text"
              placeholder="Product Title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="flex-1 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="number"
              placeholder="Price ($)"
              step="0.01"
              value={newPrice}
              onChange={(e) => setNewPrice(e.target.value)}
              className="w-32 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition font-medium cursor-pointer">
              Add Item
            </button>
          </form>
        </div>

        {/* DYNAMIC PRODUCT GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.map((product) => (
            <div key={product.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
              <div className="h-48 bg-gray-200 rounded-lg mb-4 flex items-center justify-center text-gray-400 font-bold">ID: {product.id}</div>
              <h3 className="font-bold text-lg text-gray-900">{product.title}</h3>
              <p className="text-blue-600 font-bold mt-1">${product.price.toFixed(2)}</p>
              <button className="w-full mt-4 border border-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-50 transition cursor-pointer font-medium">Add to Cart</button>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

export default App