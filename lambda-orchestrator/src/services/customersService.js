const httpClient = require('../utils/httpClient');
const { SERVICE_TOKEN, CUSTOMERS_API_URL } = process.env;

async function getCustomerById(customerId) {
  try {

    const response = await httpClient.get(`${CUSTOMERS_API_URL}/api/internal/customers/${customerId}`, {
      headers: { 'Authorization': `Bearer ${SERVICE_TOKEN}` },
    });

    return response.data;
  } catch (error) {
    if (error.response) {
      console.error('Response status:', error.response.status);
    }
    throw new Error(error.response?.data?.message || 'Failed to fetch customer');
  }
}

module.exports = { getCustomerById };
