// ========================================
// 購物車服務
// ========================================

const { fetchCart, addToCart, updateCartItem, deleteCartItem, clearCart } = require('../api');
const { validateCartQuantity, formatCurrency } = require('../utils');

/**
 * 取得購物車
 * @returns {Promise<Object>}
 */
async function getCart() {
  const cartData = await fetchCart();
  return cartData;
}

/**
 * 加入商品到購物車
 * @param {string} productId - 產品 ID
 * @param {number} quantity - 數量
 * @returns {Promise<Object>}
 */
async function addProductToCart(productId, quantity) {
  const quantityValidation = validateCartQuantity(quantity);
  if (!quantityValidation.isValid) {
    return { success: false, error: quantityValidation.error };
  }
  try {
    const cartData = await addToCart(productId, quantity);
    return { success: true, data: cartData };
  } catch (error) {
    return { success: false, error: error.message };
  } 
  const response = await axios.post(`${BASE_URL}/api/livejs/v1/customer/${API_PATH}/carts`, {
    productId,
    quantity
  });
  return { success: true, data: response.data };
}



/**
 * 更新購物車商品數量
 * @param {string} cartId - 購物車項目 ID
 * @param {number} quantity - 新數量
 * @returns {Promise<Object>}
 */
async function updateProduct(cartId, quantity) {
  const quantityValidation = validateCartQuantity(quantity);
  if (!quantityValidation.isValid) {
    return { success: false, error: quantityValidation.error };
  } 
  try {
    const cartData = await updateCartItem(cartId, quantity);
    return { success: true, data: cartData };
  } catch (error) {
    return { success: false, error: error.message };
  } 
  const response = await axios.put(`${BASE_URL}/api/livejs/v1/customer/${API_PATH}/carts/${cartId}`, {
    quantity
  }); 
  return { success: true, data: response.data };
}

/**
 * 移除購物車商品
 * @param {string} cartId - 購物車項目 ID
 * @returns {Promise<Object>}
 */
async function removeProduct(cartId) {
  try {
    const cartData = await deleteCartItem(cartId);
    return { success: true, data: cartData };
  } catch (error) {
    return { success: false, error: error.message };
  } 
}

/**
 * 清空購物車
 * @returns {Promise<Object>}
 */
async function emptyCart() {
    const response = await clearCart();
  return { success: true, data: response };
  // 請實作此函式
  // 提示：呼叫 clearCart()
  // 回傳格式：{ success: true, data: ... } 
}

/**
 * 計算購物車總金額
 * @returns {Promise<Object>}
 */
async function getCartTotal() {
    const cartData = await fetchCart();
  return { total: cartData.total, finalTotal: cartData.finalTotal, itemCount: cartData.carts ? cartData.carts.length : 0 };
}

/**
 * 顯示購物車內容
 * @param {Object} cart - 購物車資料
 */
function displayCart(cart) {
  const carts = cart.carts || [];
  if (carts.length === 0) {
    console.log('購物車是空的');
    return;
  }
  console.log('購物車內容：');
  console.log('----------------------------------------');
  carts.forEach((item, index) => {
    console.log(`${index + 1}. ${item.product.title}`);
    console.log(`   數量：${item.quantity}`);
    console.log(`   單價：${formatCurrency(item.product.price)}`);
    console.log(`   小計：${formatCurrency(item.quantity * item.product.price)}`);
    console.log('----------------------------------------');
  });
  console.log(`商品總計：${formatCurrency(cart.total)}`);
  console.log(`折扣後金額：${formatCurrency(cart.finalTotal)}`);  
  // 請實作此函式
  // 提示：先判斷購物車是否為空（cart.carts 不存在或長度為 0），若空則輸出「購物車是空的」
  // 會使用到 utils formatCurrency() 來格式化金額
  //
  // 預期輸出格式：
  // 購物車內容：
  // ----------------------------------------
  // 1. 產品名稱
  //    數量：2
  //    單價：NT$ 800
  //    小計：NT$ 1,600
  // ----------------------------------------
  // 商品總計：NT$ 1,600
  // 折扣後金額：NT$ 1,600
}

module.exports = {
  getCart,
  addProductToCart,
  updateProduct,
  removeProduct,
  emptyCart,
  getCartTotal,
  displayCart
};
