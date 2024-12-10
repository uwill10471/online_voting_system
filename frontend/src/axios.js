// src/axios.js

import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:3000',
    //withCredentials: true,  // Ensure credentials are always sent
    headers: {
        'Content-Type': 'application/json', // mewo
    },
});

export default instance;
// 