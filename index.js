const port = 1500;
const axios = require('axios');
const cron = require('node-cron');
const { createObjectCsvWriter } = require('csv-writer');

// Praser for application/json if needed
/* 
const express = require('express');=
const bodyParser = require('body-parser'); 
const app = express();
app.use(bodyParser.json()); 
*/

// CSV Writer setup
const csvWriter = createObjectCsvWriter({
    path: 'C:/Data/output.csv', // Adjust the path as needed
    header: [
        { id: 'timestamp', title: 'TIMESTAMP' },
        { id: 'ticker', title: 'TICKER' },
        { id: 'spot', title: 'SPOT' },
        { id: 'mpos_vol', title: 'MPOS_VOL' },
        { id: 'mneg_vol', title: 'MNEG_VOL' },
        { id: 'mpos_oi', title: 'MPOS_OI' },
        { id: 'mneg_oi', title: 'MNEG_OI' },
        { id: 'zero_gamma', title: 'ZERO_GAMMA' },
        { id: 'net_gex_vol', title: 'NET_GEX_VOL' },
        { id: 'net_gex_oi', title: 'NET_GEX_OI'}
    ],
    append: true,
});

// Function to fetch data and update CSV
async function fetchAndSaveData() {
    try {
        const response = await axios.get("https://api.gexbot.com/spx/gex/all/majors?key=Ly9ffs5JCG7w");
        const data = response.data;
        await csvWriter.writeRecords([data]); // Write data to CSV
    } catch (error) {
        console.error("Error:", error);
    }
}

// Schedule the task to run every 2 minutes
cron.schedule('*/2 * * * *', fetchAndSaveData);

// Start the server
server.listen(port, "127.0.0.1", () => {
    console.log(`Server is running at http://localhost:${port}`);
});

// Initial fetch
fetchAndSaveData();