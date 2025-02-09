
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = 5000;
const OPENCAGE_API_KEY = '1fc169c5e1a64d5093cce71f46c09794'; 

app.use(cors());
app.use(express.json());


const getCoordinatesFromPincode = async (pincode) => {
    try {
        const response = await axios.get(`https://api.opencagedata.com/geocode/v1/json`, {
            params: {
                q: pincode,
                key: OPENCAGE_API_KEY,
                
            },
        });

        if (response.data.results.length > 0) {
            const { lat, lng } = response.data.results[0].geometry;
            return { latitude: lat, longitude: lng };
        } else {
            return { latitude: null, longitude: null };
        }
    } catch (error) {
        console.error('Error fetching coordinates:', error);
        return { latitude: null, longitude: null };
    }
};

app.get('/api/nearest-plants', async (req, res) => {
    const { pincode } = req.query;

    try {
        const { latitude, longitude } = await getCoordinatesFromPincode(pincode);

        if (!latitude || !longitude) {
            return res.status(400).json({ error: 'Invalid pincode or no coordinates found' });
        }

        const apiUrl = `https://api.example.com/plants?lat=${latitude}&lng=${longitude}`;

        const response = await axios.get(apiUrl);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching data' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});