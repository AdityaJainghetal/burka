"use client"

import { useEffect, useState } from "react"
import { deleteProduct, fetchcategory, fetchProducts, fetchSubcategory } from "../api"
import { Package, Search, RefreshCw, Trash2, ShoppingCart, Tag, Info, X } from "lucide-react"
import { useCart } from "../CartContext"

const ProductList = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [categories, setCategories] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [subCategories, setSubCategories] = useState([])
  const { fetchCart } = useCart()
  const [addingToCart, setAddingToCart] = useState({})
  const [selectedProduct, setSelectedProduct] = useState(null)


  const loadProducts = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetchProducts()
      setProducts(res.data)
    } catch (err) {
      console.error("Failed to fetch products:", err)
      setError("Failed to load products. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const deleteP = async (id) => {
    const res = await deleteProduct(id)
    if (res.data) {
      setProducts(res.data.data)
    }
  }

  useEffect(() => {
    loadProducts()
  }, [])

  const filteredProducts = products.filter((product) => product.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const addToCart = async (productId) => {
    setAddingToCart((prev) => ({ ...prev, [productId]: true }))
    try {
      await fetch(`https://burka.onrender.com/cart/add/${productId}`, {
        method: "POST",
      })
      await fetchCart()
    } catch (err) {
      console.error("Failed to add product to cart:", err)
    } finally {
      setAddingToCart((prev) => ({ ...prev, [productId]: false }))
    }
  }

  return (
    <div className="bg-white shadow rounded-lg mt-2 md:ml-32 ">
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800 flex items-center">
          <Package className="mr-2" size={24} />
          Product List
        </h2>
        <button
          onClick={loadProducts}
          className="p-2 text-gray-500 hover:text-primary-600 focus:outline-none"
          title="Refresh products"
        >
          <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center p-8">
          <RefreshCw size={24} className="animate-spin text-primary-600" />
          <span className="ml-2 text-gray-600">Loading products...</span>
        </div>
      ) : error ? (
        <div className="p-8 text-center text-red-600">{error}</div>
      ) : filteredProducts.length === 0 ? (
        <div className="p-8 text-center text-gray-500">
          {searchTerm ? "No products match your search." : "No products available."}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
          {filteredProducts.map((product) => (
            <div
              key={product._id}
              className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="relative">
                {/* Product Image */}
                <div className="h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
                  {product.images && product.images.length > 0 ? (
                    <img
                      src={product.images[0] || "/placeholder.svg"}
                      alt={product.name}
                      className="h-[100%] "
                    />
                  ) : (
                    <div className="text-gray-400 flex flex-col items-center">
                      <Package size={48} />
                      <span className="text-sm mt-2">No image</span>
                    </div>
                  )}
                </div>

                {/* Discount Badge */}
                {product.MRP && product.price && product.mrp > product.price && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                    {Math.round(((product.mrp - product.price) / product.mrp) * 100)}% OFF
                  </div>
                )}
              </div>

              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-medium text-gray-900">{product.name}</h3>
                  <div className="flex space-x-1">
                    <button
                      className={`p-1.5 rounded-full ${addingToCart[product._id] ? "bg-gray-200" : "bg-primary-50 hover:bg-primary-100"}`}
                      onClick={() => addToCart(product._id)}
                      disabled={addingToCart[product._id]}
                      title="Add to cart"
                    >
                      {addingToCart[product._id] ? (
                        <RefreshCw size={16} className="text-primary-600 animate-spin" />
                      ) : (
                        <ShoppingCart size={16} className="text-primary-600" />
                      )}
                    </button>
                    <button
                      className="p-1.5 rounded-full bg-red-50 hover:bg-red-100"
                      onClick={() => deleteP(product._id)}
                      title="Delete product"
                    >
                      <Trash2 size={16} className="text-red-600" />
                    </button>
                    <button
                      className="p-1.5 rounded-full bg-blue-50 hover:bg-blue-100"
                      onClick={() => setSelectedProduct(product)}
                      title="View details"
                    >
                      <Info size={16} className="text-blue-600" />
                    </button>
                  </div>
                </div>

                {/* Price */}
                <div className="flex items-baseline mb-2">
                  <span className="text-primary-600 font-bold text-lg">
                    ₹{Number.parseFloat(product.price).toFixed(2)}
                  </span>
                  {product.mrp && product.mrp > product.price && (
                    <span className="ml-2 text-gray-500 text-sm line-through">
                      ₹{Number.parseFloat(product.mrp).toFixed(2)}
                    </span>
                  )}
                </div>

                {/* Category & Size */}
                <div className="flex flex-wrap gap-1 mb-2">
                  {product.category && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 text-black">
                      <Tag size={12} className="mr-1" />
                      {product.category.name}
                    </span>
                  )}

                  {product.size && product.size.length > 0 && (
                    <div className="flex gap-1 ml-auto">
                      {product.size.map((size) => (
                        <span key={size} className="inline-block px-1.5 py-0.5 text-xs border border-gray-300 rounded text-black">
                          {size}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Color & Fabric */}
                {(product.color || product.fabric) && (
                  <div className="text-sm text-gray-600 mb-2">
                    {product.color && <span>{product.color}</span>}
                    {product.color && product.fabric && <span> • </span>}
                    {product.fabric && <span>{product.fabric}</span>}
                  </div>
                )}

                {/* Description Preview */}
                {product.description && <p className="text-sm text-gray-500 line-clamp-2">{product.description}</p>}
              </div>

              {/* QR Code */}
              {product.barcode && (
                <div className="bg-gray-50 p-2 flex justify-center border-t border-gray-200">
                  <img
                    src={product.barcode || "/placeholder.svg"}
                    alt={`QR Code for ${product.name}`}
                    className="h-24 w-96 object-contain scale-2"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold">{selectedProduct.name}</h2>
                <button onClick={() => setSelectedProduct(null)} className="text-gray-500 hover:text-gray-700">
                  <X size={24} />
                </button>
              </div>

              {/* Image Gallery */}
              {selectedProduct.images && selectedProduct.images.length > 0 ? (
                <div className="grid grid-cols-4 gap-2 mb-6">
                  <div className="col-span-4 h-64 bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={selectedProduct.images[0] || "/placeholder.svg"}
                      alt={selectedProduct.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  {selectedProduct.images.slice(1).map((image, index) => (
                    <div key={index} className="h-16 bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src={image || "/placeholder.svg"}
                        alt={`${selectedProduct.name} ${index + 2}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center mb-6">
                  <div className="text-gray-400 flex flex-col items-center">
                    <Package size={64} />
                    <span className="text-sm mt-2">No images available</span>
                  </div>
                </div>
              )}

              {/* Price Information */}
              <div className="flex items-baseline mb-4">
                <span className="text-primary-600 font-bold text-2xl">
                  ₹{Number.parseFloat(selectedProduct.price).toFixed(2)}
                </span>
                {selectedProduct.mrp && selectedProduct.mrp > selectedProduct.price && (
                  <>
                    <span className="ml-2 text-gray-500 text-lg line-through">
                      ₹{Number.parseFloat(selectedProduct.mrp).toFixed(2)}
                    </span>
                    <span className="ml-2 bg-red-100 text-red-800 text-sm font-medium px-2 py-0.5 rounded">
                      {Math.round(((selectedProduct.mrp - selectedProduct.price) / selectedProduct.mrp) * 100)}% OFF
                    </span>
                  </>
                )}
              </div>

              {/* Product Details */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                {selectedProduct.category && (
                  <div>
                    <h3 className="text-sm text-gray-500">Category</h3>
                    <p className="text-black">{(selectedProduct?.category?.name)}</p>
                  </div>
                )}

                {selectedProduct.subCategory && (
                  <div>
                    <h3 className="text-sm text-gray-500">Sub-Category</h3>
                    <p className="text-black">{selectedProduct.subCategory.name}</p>
                  </div>
                )}

                {selectedProduct.color && (
                  <div>
                    <h3 className="text-sm text-gray-500">Color</h3>
                    <p className="text-black">{selectedProduct.color}</p>
                  </div>
                )}

                {selectedProduct.fabric && (
                  <div>
                    <h3 className="text-sm text-gray-500">Fabric</h3>
                    <p className="text-black">{selectedProduct.fabric}</p>
                  </div>
                )}

                {selectedProduct.size && selectedProduct.size.length > 0 && (
                  <div>
                    <h3 className="text-sm text-gray-500">Available Sizes</h3>
                    <div className="flex gap-2 mt-1">
                      {selectedProduct.size.map((size) => (
                        <span key={size} className="inline-block px-2 py-1 border border-gray-300 rounded text-black">
                          {size}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Description */}
              {selectedProduct.description && (
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-2 text-black">Description</h3>
                  <p className="text-gray-600">{selectedProduct.description}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    addToCart(selectedProduct._id)
                    setSelectedProduct(null)
                  }}
                  className="flex-1 bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded-md flex items-center justify-center"
                >
                  <ShoppingCart size={18} className="mr-2" />
                  Add to Cart
                </button>
                <button
                  onClick={() => {
                    deleteP(selectedProduct._id)
                    setSelectedProduct(null)
                  }}
                  className="bg-red-50 hover:bg-red-100 text-red-600 py-2 px-4 rounded-md flex items-center justify-center"
                >
                  <Trash2 size={18} className="mr-2" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductList
