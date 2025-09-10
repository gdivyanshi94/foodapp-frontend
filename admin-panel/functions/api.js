const axios = require('axios');

exports.handler = async (event, context) => {
  const { httpMethod, path, headers, body } = event;
  
  // Extract the API path (remove /.netlify/functions/api from the beginning)
  const apiPath = path.replace('/.netlify/functions/api', '');
  
  // Your backend API base URL
  const backendUrl = 'http://3.109.184.36:6001';
  
  try {
    // Prepare headers for backend request
    const backendHeaders = {
      'Content-Type': 'application/json',
    };
    
    // Forward authorization header if present
    if (headers.authorization) {
      backendHeaders.authorization = headers.authorization;
    }
    
    // Make request to backend using axios
    const response = await axios({
      method: httpMethod.toLowerCase(),
      url: `${backendUrl}${apiPath}`,
      headers: backendHeaders,
      data: httpMethod !== 'GET' && httpMethod !== 'HEAD' ? JSON.parse(body || '{}') : undefined,
    });
    
    return {
      statusCode: response.status,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(response.data),
    };
  } catch (error) {
    return {
      statusCode: error.response?.status || 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        error: 'API Error', 
        message: error.message,
        data: error.response?.data 
      }),
    };
  }
};