// ========================================
// 訂單服務
// ========================================

const { createOrder, fetchOrders, updateOrderStatus, deleteOrder } = require('../api');
const { validateOrderUser, formatDate, getDaysAgo, formatCurrency } = require('../utils');

/**
 * 建立新訂單
 * @param {Object} userInfo - 使用者資料
 * @returns {Promise<Object>}
 */
async function placeOrder(userInfo) {
    const validationResult = validateOrderUser(userInfo);
  if (!validationResult.isValid) {
    return { success: false, errors: validationResult.errors };
  }
  try {
    const orderData = await createOrder(userInfo);
    return { success: true, data: orderData };
  } catch (error) {
    return { success: false, errors: [error.message] };
  } 
}

/**
 * 取得所有訂單
 * @returns {Promise<Array>}
 */
async function getOrders() {
    const orders = await fetchOrders();
  return orders;
}

/**
 * 取得未付款訂單
 * @returns {Promise<Array>}
 */
async function getUnpaidOrders() {
    const orders = await fetchOrders();
  const unpaidOrders = orders.filter(order => !order.paid);
  return unpaidOrders;
}

/**
 * 取得已付款訂單
 * @returns {Promise<Array>}
 */
async function getPaidOrders() {
    const orders = await fetchOrders();
  const paidOrders = orders.filter(order => order.paid);
  return paidOrders;
}

/**
 * 更新訂單付款狀態
 * @param {string} orderId - 訂單 ID
 * @param {boolean} isPaid - 是否已付款
 * @returns {Promise<Object>}
 */
async function updatePaymentStatus(orderId, isPaid) {
  try {
    const response = await updateOrderStatus(orderId, isPaid);
    return { success: true, data: response };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * 刪除訂單
 * @param {string} orderId - 訂單 ID
 * @returns {Promise<Object>}
 */
async function removeOrder(orderId) {
  try {   
    const response = await deleteOrder(orderId);
    return { success: true, data: response };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * 格式化訂單資訊
 * @param {Object} order - 訂單物件
 * @returns {Object} - 格式化後的訂單
 *
 * 回傳物件包含以下欄位：
 * - id: 訂單 ID
 * - user: 使用者資料
 * - products: 商品陣列
 * - total: 總金額（原始數字）
 * - totalFormatted: 格式化金額，使用 utils formatCurrency()
 * - paid: 付款狀態（布林值）
 * - paidText: 付款狀態文字，true → '已付款'，false → '未付款'
 * - createdAt: 格式化後的建立時間，使用 utils formatDate()
 * - daysAgo: 距離今天為幾天前，使用 utils getDaysAgo()
 */
function formatOrder(order) {
    return {
    id: order.id,
    user: order.user,
    products: order.products,
    total: order.total,
    totalFormatted: formatCurrency(order.total),
    paid: order.paid,
    paidText: order.paid ? '已付款' : '未付款',
    createdAt: formatDate(order.createdAt),
    daysAgo: getDaysAgo(order.createdAt)
  };
}

/**
 * 顯示訂單列表
 * @param {Array} orders - 訂單陣列
 */
function displayOrders(orders) {
    if (orders.length === 0) {
    console.log('沒有訂單');
    return;
  }
  console.log('訂單列表：');
  console.log('========================================');
  console.log(orders.map(formatOrder).join('\n----------------------------------------\n'));
  console.log('========================================');
  // 請實作此函式
  // 提示：先判斷訂單陣列是否為空，若空則輸出「沒有訂單」
  // 使用 formatOrder() 格式化每筆訂單後再輸出
  //
  // 預期輸出格式：
  // 訂單列表：
  // ========================================
  // 訂單 1
  // ----------------------------------------
  // 訂單編號：xxx
  // 顧客姓名：王小明
  // 聯絡電話：0912345678
  // 寄送地址：台北市...
  // 付款方式：Credit Card
  // 訂單金額：NT$ 1,000
  // 付款狀態：已付款
  // 建立時間：2024-01-01 (3 天前)
  // ----------------------------------------
  // 商品明細：
  //   - 產品名稱 x 2（產品數量）
  // ========================================
}

module.exports = {
  placeOrder,
  getOrders,
  getUnpaidOrders,
  getPaidOrders,
  updatePaymentStatus,
  removeOrder,
  formatOrder,
  displayOrders
};
