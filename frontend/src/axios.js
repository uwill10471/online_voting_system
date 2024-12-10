// src/axios.js

import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://ovs-gr0w.onrender.com',
    //withCredentials: true,  // Ensure credentials are always sent
    headers: {
        'Content-Type': 'application/json', // mewo
    },
});

export default instance;
// 