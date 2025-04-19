import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom"
import { Home, QrCode, PlusCircle, ShoppingCart, Layers } from "lucide-react"
import ScanQRCode from "./pages/ScanQRCode"
import CreateProduct from "./pages/CreateProduct"
import ProductList from "./pages/ProductList"
import { CartProvider, useCart } from "./CartContext"
import CartPage from "./pages/CartPage"
import CategoryManagement from "./pages/CategoryManagement"
import SubCategoryManagement from "./pages/SubCategory"
import Registration from "./pages/Registration"
import Login from "./pages/Login"
import Sidbar from "./pages/Navbar"

function App() {
  return (
    <CartProvider>
      <Router>
        <AppContent />
      </Router>
    </CartProvider>
  )
}

function AppContent() {
  const { cart } = useCart() // Fetch cart quantity from CartContext

  return (
    <div className="min-h-screen flex  bg-gray-50">
     <header className="bg-white shadow-sm">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex justify-between h-16 items-center">
     
      {/* Only keep Cart icon in top navbar */}
      <div className="hidden md:flex items-center space-x-4">
      <div className="flex-shrink-0 flex items-center">
        <h1 className="text-xl font-bold text-primary-600">ProductScan</h1>
      </div>
        <NavLink
          to="/cart"
          className={({ isActive }) =>
            isActive
              ? "text-primary-600 relative"
              : "text-gray-500 hover:text-gray-700 relative"
          }
        >
          <ShoppingCart size={24} />
          {cart.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
              {cart.length}
            </span>
          )}
        </NavLink>
      </div>
    </div>
  </div>
<Sidbar/>
</header>


      <main className=" mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <Routes>
            <Route path="/" element={<ProductList />} />
            <Route path="/scan" element={<ScanQRCode />} />
            <Route path="/create" element={<CreateProduct />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/categories" element={<CategoryManagement />} />
            <Route path="/subcategories" element={<SubCategoryManagement />} />
            <Route path="/registration" element={<Registration/>}/>
            <Route path="/login" element={<Login/>}/>
          </Routes>
        </div>
      </main>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200">
        <div className="flex justify-around">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? "text-primary-600 flex flex-col items-center py-2 px-3"
                : "text-gray-500 hover:text-gray-700 flex flex-col items-center py-2 px-3"
            }
          >
            <Home size={24} />
            <span className="text-xs mt-1">Products</span>
          </NavLink>
          <NavLink
            to="/scan"
            className={({ isActive }) =>
              isActive
                ? "text-primary-600 flex flex-col items-center py-2 px-3"
                : "text-gray-500 hover:text-gray-700 flex flex-col items-center py-2 px-3"
            }
          >
            <QrCode size={24} />
            <span className="text-xs mt-1">Scan</span>
          </NavLink>
          <NavLink
            to="/create"
            className={({ isActive }) =>
              isActive
                ? "text-primary-600 flex flex-col items-center py-2 px-3"
                : "text-gray-500 hover:text-gray-700 flex flex-col items-center py-2 px-3"
            }
          >
            <PlusCircle size={24} />
            <span className="text-xs mt-1">Add</span>
          </NavLink>
          <NavLink
            to="/categories"
            className={({ isActive }) =>
              isActive
                ? "text-primary-600 flex flex-col items-center py-2 px-3"
                : "text-gray-500 hover:text-gray-700 flex flex-col items-center py-2 px-3"
            }
          >
            <Layers size={24} />
            <span className="text-xs mt-1">Categories</span>
          </NavLink>
          {/* Cart Link for Mobile */}
          <NavLink
            to="/cart"
            className={({ isActive }) =>
              isActive
                ? "text-primary-600 flex flex-col items-center py-2 px-3"
                : "text-gray-500 hover:text-gray-700 flex flex-col items-center py-2 px-3"
            }
          >
            <div className="relative">
              <ShoppingCart size={24} />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
                  {cart.length}
                </span>
              )}
            </div>
            <span className="text-xs mt-1">Cart</span>
          </NavLink>
        </div>
      </nav>
    </div>
  )
}

export default App
