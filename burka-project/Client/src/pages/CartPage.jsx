import { useState, useEffect } from "react";
import { useCart } from "../CartContext";
import axios from "axios";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import {
  Trash2,
  Plus,
  Minus,
  ShoppingCart,
  AlertCircle,
  CreditCard,
  Download,
  X,
  CheckCircle,
  Loader2,
} from "lucide-react";

const CartPage = () => {
  const { cart, fetchCart } = useCart();
  const [editedQuantities, setEditedQuantities] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [itemsBeingDeleted, setItemsBeingDeleted] = useState({});
  const [vendors, setVendors] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState("");
  const [discount, setDiscount] = useState(0);

  // Checkout & payment states
  const [modalOpen, setModalOpen] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [checkoutDone, setCheckoutDone] = useState(false);

  // Initialize quantities
  useEffect(() => {
    const initial = {};
    cart.forEach((item) => {
      initial[item._id] = item.quantity;
    });
    setEditedQuantities(initial);
  }, [cart]);

  // Load vendors
  useEffect(() => {
    const fetchVendors = async () => {
      setLoading(true);
      try {
        const res = await axios.get("https://burka.onrender.com/user");
        setVendors(res.data);
      } catch {
        setError("Failed to load vendors.");
      } finally {
        setLoading(false);
      }
    };
    fetchVendors();
  }, []);

  // Apply vendor discount
  useEffect(() => {
    const vendor = vendors.find((v) => v._id === selectedVendor);
    setDiscount(vendor?.discount || 0);
  }, [selectedVendor, vendors]);

  // Calculate totals
  const calculateTotal = () => {
    const subtotal = cart.reduce(
      (sum, item) => sum + item.product.price * editedQuantities[item._id],
      0
    );
    const discAmt = (subtotal * discount) / 100;
    return { subtotal, discount: discAmt, total: subtotal - discAmt };
  };
  const { subtotal, discount: discountAmount, total } = calculateTotal();

  // Generate PDF invoice
  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Invoice", 10, 10);

    const cols = ["Product", "Price", "Qty", "Subtotal"];
    const rows = cart.map((item) => [
      item.product.name,
      `₹${item.product.price}`,
      editedQuantities[item._id],
      `₹${(
        item.product.price *
        editedQuantities[item._id]
      ).toFixed(2)}`,
    ]);

    autoTable(doc, { head: [cols], body: rows, startY: 20 });
    const startY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(12);
    doc.text(`Subtotal: ₹${subtotal.toFixed(2)}`, 10, startY);
    doc.text(
      `Discount (${discount}%): ₹${discountAmount.toFixed(2)}`,
      10,
      startY + 10
    );
    doc.setFontSize(14);
    doc.text(`Total: ₹${total.toFixed(2)}`, 10, startY + 20);
    doc.save("invoice.pdf");
  };

  // Change quantity
  const handleQuantityChange = (id, qty) => {
    if (qty < 1) return;
    setEditedQuantities((prev) => ({ ...prev, [id]: qty }));
  };

  // Remove single item
  const handleDelete = async (id) => {
    setItemsBeingDeleted((prev) => ({ ...prev, [id]: true }));
    try {
      await axios.delete(`https://burka.onrender.com/cart/remove/${id}`);
      await fetchCart();
    } catch {
      setError("Failed to delete.");
    } finally {
      setItemsBeingDeleted((prev) => ({ ...prev, [id]: false }));
    }
  };

  // Checkout modal controls
  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  // Process payment and clear cart
  const handlePayment = () => {
    setProcessingPayment(true);
    setError(null);

    setTimeout(() => {
      setProcessingPayment(false);
      setPaymentSuccess(true);

      // Remove all items after success
      Promise.all(
        cart.map((item) =>
          axios.delete(
            `https://burka.onrender.com/cart/remove/${item.product._id}`
          )
        )
      )
        .then(() => fetchCart())
        .finally(() => {
          setTimeout(() => {
            closeModal();
            setCheckoutDone(true);
          }, 1000);
        });
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 text-gray-800">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-100 rounded-lg">
          <ShoppingCart className="h-5 w-5 text-blue-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800">Your Shopping Cart</h1>
        {cart.length > 0 && (
          <span className="ml-auto bg-gray-100 px-3 py-1 rounded-full text-sm font-medium">
            {cart.length} {cart.length === 1 ? "item" : "items"}
          </span>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md flex items-center gap-2 border border-red-100">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}

      {/* Empty State */}
      {cart.length === 0 ? (
        <div className="border rounded-lg shadow-sm flex flex-col items-center py-16 bg-gray-50">
          <ShoppingCart className="h-16 w-16 text-gray-400 mb-4" />
          <p className="text-lg text-gray-500 mb-2">Your cart is empty</p>
          <p className="text-sm text-gray-400 mb-6">Add some products to get started</p>
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div
                key={item._id}
                className="border rounded-lg shadow-sm p-4 flex flex-col sm:flex-row justify-between gap-4 bg-white hover:shadow-md transition-shadow"
              >
                <div className="flex gap-4">
                  <div className="w-20 h-20 bg-gray-100 rounded-md flex items-center justify-center">
                    {item.product.image ? (
                      <img 
                        src={item.product.image} 
                        alt={item.product.name}
                        className="w-full h-full object-cover rounded-md"
                      />
                    ) : (
                      <ShoppingCart className="h-6 w-6 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <h2 className="font-medium text-lg text-gray-800">
                      {item.product.name}
                    </h2>
                    <p className="text-gray-500 text-sm">
                      ₹{item.product.price.toLocaleString()} each
                    </p>
                    <div className="flex items-center mt-3">
                      <button
                        disabled={editedQuantities[item._id] <= 1}
                        onClick={() =>
                          handleQuantityChange(
                            item._id,
                            editedQuantities[item._id] - 1
                          )
                        }
                        className="h-8 w-8 border rounded-l hover:bg-gray-50 disabled:opacity-50 flex items-center justify-center"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <input
                        type="number"
                        value={editedQuantities[item._id]}
                        onChange={(e) =>
                          handleQuantityChange(
                            item._id,
                            parseInt(e.target.value) || 1
                          )
                        }
                        min="1"
                        className="h-8 w-12 text-center border-t border-b focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                      <button
                        onClick={() =>
                          handleQuantityChange(
                            item._id,
                            editedQuantities[item._id] + 1
                          )
                        }
                        className="h-8 w-8 border rounded-r hover:bg-gray-50 flex items-center justify-center"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end justify-between">
                  <p className="font-medium text-lg text-gray-800">
                    ₹
                    {(
                      item.product.price *
                      editedQuantities[item._id]
                    ).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </p>

                  <div className="mt-3 flex items-center gap-2">
                    <select 
                      className="text-sm border rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      disabled={itemsBeingDeleted[item._id]}
                    >
                      <option value="">Payment</option>
                      <option value="gpay">G-Pay</option>
                      <option value="phonepay">Phone-Pay</option>
                      <option value="card">Card</option>
                    </select>
                    
                    <button
                      onClick={() => handleDelete(item.product._id)}
                      disabled={itemsBeingDeleted[item._id]}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-full disabled:opacity-50"
                    >
                      {itemsBeingDeleted[item._id] ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary & Actions */}
          <div className="lg:col-span-1">
            <div className="border rounded-lg shadow-sm p-5 bg-white sticky top-4">
              <h2 className="text-lg font-semibold mb-4 text-gray-800">Order Summary</h2>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Vendor
                </label>
                <select
                  value={selectedVendor}
                  onChange={(e) => setSelectedVendor(e.target.value)}
                  className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">Select a vendor</option>
                  {vendors.map((v) => (
                    <option key={v._id} value={v._id}>
                      {v.firmName}
                    </option>
                  ))}
                </select>
              </div>
              
              {discount > 0 && (
                <div className="mb-4 p-3 bg-green-50 rounded-md border border-green-100">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-green-700">Discount Applied</span>
                    <span className="text-sm font-bold text-green-700">{discount}% OFF</span>
                  </div>
                </div>
              )}

              <div className="space-y-2 mb-4">
                <div className="flex justify-between py-1 text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">₹{subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between py-1 text-sm">
                    <span className="text-gray-600">Discount</span>
                    <span className="text-green-600 font-medium">-₹{discountAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                  </div>
                )}
                <hr className="my-2 border-gray-200" />
                <div className="flex justify-between py-1 font-bold text-base">
                  <span className="text-gray-800">Total</span>
                  <span className="text-blue-600">₹{total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
              </div>

              <div className="mt-6">
                {!checkoutDone ? (
                  <button
                    onClick={openModal}
                    disabled={!selectedVendor}
                    className={`w-full px-4 py-3 rounded-lg flex items-center justify-center gap-2 transition-colors ${
                      !selectedVendor
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                        : "bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
                    }`}
                  >
                    <CreditCard className="h-5 w-5" />
                    <span>Proceed to Checkout</span>
                  </button>
                ) : (
                  <button
                    onClick={generatePDF}
                    className="w-full px-4 py-3 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center gap-2 text-gray-800 transition-colors"
                  >
                    <Download className="h-5 w-5" />
                    <span>Download Invoice</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full mx-4 animate-fade-in">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Confirm Payment
              </h2>
              <button
                onClick={closeModal}
                disabled={processingPayment}
                className="p-1 rounded-full hover:bg-gray-100 disabled:opacity-50"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <div className="space-y-3 mb-6">
              {cart.map((item) => (
                <div
                  key={item._id}
                  className="flex justify-between items-center py-2 border-b border-gray-100"
                >
                  <div>
                    <p className="font-medium text-gray-800">
                      {item.product.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {editedQuantities[item._id]} × ₹{item.product.price.toLocaleString()}
                    </p>
                  </div>
                  <span className="font-medium">
                    ₹
                    {(
                      item.product.price *
                      editedQuantities[item._id]
                    ).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                </div>
              ))}
              
              <div className="pt-2 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal:</span>
                  <span>₹{subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Discount:</span>
                    <span className="text-green-600">-₹{discountAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold pt-2">
                  <span>Total:</span>
                  <span className="text-blue-600">₹{total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={handlePayment}
                disabled={processingPayment || paymentSuccess}
                className={`px-4 py-3 rounded-lg flex items-center justify-center gap-2 ${
                  processingPayment || paymentSuccess
                    ? "bg-green-100 text-green-800"
                    : "bg-green-600 text-white hover:bg-green-700"
                } transition-colors`}
              >
                {processingPayment ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Processing Payment...</span>
                  </>
                ) : paymentSuccess ? (
                  <>
                    <CheckCircle className="h-5 w-5" />
                    <span>Payment Successful</span>
                  </>
                ) : (
                  <>
                    <CreditCard className="h-5 w-5" />
                    <span>Confirm Payment</span>
                  </>
                )}
              </button>
              
              {!paymentSuccess && (
                <button
                  onClick={closeModal}
                  disabled={processingPayment}
                  className="px-4 py-2 rounded-lg border hover:bg-gray-50 transition-colors text-gray-700 disabled:opacity-50"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;