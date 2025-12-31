import axios from 'axios';

const API_BASE_URL = 'http://localhost:5001/api';

export const getSpendingData = async (filters) => {
  const params = new URLSearchParams();
  if (filters.state) params.append('state', filters.state);
  if (filters.num_children) params.append('num_children', filters.num_children);
  if (filters.age) params.append('age', filters.age);
  
  const response = await axios.get(`${API_BASE_URL}/spending/filter?${params}`);
  return response.data;
};

export const getStats = async () => {
  const response = await axios.get(`${API_BASE_URL}/spending/stats`);
  return response.data;
};