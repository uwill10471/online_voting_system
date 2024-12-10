import express from 'express'
import fetch from 'node-fetch'
import dotenv from 'dotenv'
const router = express.Router()
dotenv.config()

const apiKey = process.env.NEWS_API_KEY;
    const apiUrl = process.env.NEWS_API_URL;
   const url = `${apiUrl}/everything?q=indian+election&sortBy=publishedAt&apiKey=${apiKey}`; 

router.get("/", async (req, res) => { 
    try { const response = await fetch(url); 
    if (!response.ok) { 
        throw new Error('Network response was not ok ' + response.statusText); 
    } 
    const data = await response.json(); 
    //console.log(data); 
    res.status(200).json(data); 
} catch (err) { 
    console.error('Error fetching news:', err); 
    res.status(500).send("Error fetching news"); 
} 
});

export default router
