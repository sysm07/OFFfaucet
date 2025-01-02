const axios = require('axios');
const fs = require('fs');

// Load wallet addresses from a file (e.g., listaddress.txt)
const addresses = fs.readFileSync('listaddress.txt', 'utf-8').split('\n').filter(Boolean);

// Base API endpoint
const API_URL = 'https://faucet-test.haust.network/api/claim';

// Function to claim faucet for a single address
async function claimFaucet(address) {
    while (true) {
        try {
            console.log(`Attempting to claim for: ${address}`);
            const response = await axios.post(API_URL, { address });
            
            // Log the status message
            console.log(`Address: ${address} | Status: ${response.data.message}`);
            
            // Check if claim was successful
            if (response.data.message && response.data.message.includes('success')) {
                console.log(`Claim successful for ${address}!`);
                break; // Exit loop on success
            } else {
                console.log(`Retrying for ${address}...`);
            }
        } catch (error) {
            console.error(`Address: ${address} | Error: ${error.response?.data?.message || error.message}`);
            console.log('Retrying...');
        }

        // Wait for 5 seconds before retrying
        await new Promise(resolve => setTimeout(resolve, 5000));
    }
}

// Main function to process all addresses
async function main() {
    console.log('Starting auto claim script...');
    for (const address of addresses) {
        await claimFaucet(address);
        // Optional: Wait before processing the next address
        console.log('Waiting 10 seconds before processing the next address...');
        await new Promise(resolve => setTimeout(resolve, 10000));
    }
    console.log('All claims completed.');
}

main();
