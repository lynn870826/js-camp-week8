// ========================================
// 產品服務
// ========================================

const { fetchProducts } = require('../api');
const { getDiscountRate, getAllCategories, formatCurrency } = require('../utils');

/**
 * 取得所有產品
 * @returns {Promise<Object>}
 */
async function getProducts() {
  const products = await fetchProducts();
  return { products, count: products.length };
} 

/**
 * 根據分類篩選產品
 * @param {string} category - 分類名稱
 * @returns {Promise<Array>}
 */
async function getProductsByCategory(category) {
  const products = await fetchProducts();
  const filteredProducts = products.filter(product => product.category === category);
  return filteredProducts;
}

/**
 * 根據 ID 取得單一產品
 * @param {string} productId - 產品 ID
 * @returns {Promise<Object|null>}
 */
async function getProductById(productId) {
  const products = await fetchProducts();
  const product = products.find(p => p.id === productId);
  return product || null;
}

/**
 * 取得所有分類（不重複）
 * @returns {Promise<Array>}
 */
async function getCategories() {
  const products = await fetchProducts();
  return getAllCategories(products);
}

/**
 * 顯示產品列表
 * @param {Array} products - 產品陣列
 */
function displayProducts(products) {
  if (products.length === 0) {
    console.log('沒有產品');
    return;
  }
  console.log('產品列表：');
  console.log('========================================');
  products.forEach((product, index) => {
    console.log(`${index + 1}. ${product.title}`);
    console.log(`   分類：${product.category}`);
    console.log(`   原價：${formatCurrency(product.originPrice)}`);
    console.log(`   售價：${formatCurrency(product.price)} (${getDiscountRate(product)})`);
    console.log('----------------------------------------');
  }
  );
  console.log('========================================');
}

module.exports = {
  getProducts,
  getProductsByCategory,
  getProductById,
  getCategories,
  displayProducts
};
