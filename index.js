const axios = require('axios');
const cron = require('node-cron');
const fs = require('fs');
const { createObjectCsvWriter } = require('csv-writer');

// Praser for application/json if needed
/* 
const port = 1500;
const express = require('express');=
const bodyParser = require('body-parser'); 
const app = express();
app.use(bodyParser.json()); 
*/

// Define the CSV file path, adjust as needed
const csvFilePath = 'C:/GexBotData/output.csv';

const csvHeaders = {
    timestamp: 'TIMESTAMP',
    ticker: 'TICKER',
    spot: 'SPOT',
    mpos_vol: 'MPOS_VOL',
    mneg_vol: 'MNEG_VOL',
    mpos_oi: 'MPOS_OI',
    mneg_oi: 'MNEG_OI',
    zero_gamma: 'ZERO_GAMMA',
    net_gex_vol: 'NET_GEX_VOL',
    net_gex_oi: 'NET_GEX_OI'
};


// CSV Writer setup
const csvWriter = createObjectCsvWriter({
    path: csvFilePath, 
    header: [
        { id: 'timestamp', title: 'timestamp' },
        { id: 'ticker', title: 'TICKER' },
        { id: 'spot', title: 'SPOT' },
        { id: 'mpos_vol', title: 'MPOS_VOL' },
        { id: 'mneg_vol', title: 'MNEG_VOL' },
        { id: 'mpos_oi', title: 'MPOS_OI' },
        { id: 'mneg_oi', title: 'MNEG_OI' },
        { id: 'zero_gamma', title: 'ZERO_GAMMA' },
        { id: 'net_gex_vol', title: 'NET_GEX_VOL' },
        { id: 'net_gex_oi', title: 'NET_GEX_OI' }
    ],
    append: true,
});

// Function to fetch data and update CSV
async function fetchAndSaveData() {
    try {
        const fileExists = fs.existsSync(csvFilePath);

        if (!fileExists) {
            csvWriter.writeRecords([csvHeaders]);
        }
        const response = await axios.get("https://api.gexbot.com/spx/gex/all/majors?key=Ly9ffs5JCG7w");
        const data = response.data;
        console.log("Fetched latest data:")
        console.log([data]);
        tryWriteData([data], 0);
    } catch (error) {
        console.error("Error:", error);
    }
}

async function tryWriteData(data, attempt) {
    const maxAttempts = 10;
    try {
        await csvWriter.writeRecords(data);
    } catch (error) {
        if (error.code === 'EBUSY' && attempt < maxAttempts) {
            console.log(`Attempt ${attempt + 1}: File is busy. Retrying...`);
            setTimeout(() => tryWriteData(data, attempt + 1), 10000); // Retry after 10 seconds if file is currently open
        } else {
            console.error("Error writing data:", error);
        }
    }
}

// Schedule the task to run every 2 minutes between 9am - 5pm every day only,
cron.schedule('*/2 9-16 * * *', fetchAndSaveData);

// Schedule the task to run every 2 minutes all day
// cron.schedule('*/2 * * * *', fetchAndSaveData);

/* Start the server
server.listen(port, "127.0.0.1", () => {
    console.log(`Server is running at http://localhost:${port}`);
});
*/

// Initial fetch
fetchAndSaveData();