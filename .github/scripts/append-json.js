const fs = require('fs');
const path = require('path');
const axios = require('axios');

async function run() {
  try {
    // Get the PR number
    const prNumber = process.env.GITHUB_EVENT_NUMBER;

    // Get the PR details using the GitHub API
    const owner = process.env.GITHUB_REPOSITORY.split('/')[0];
    const repo = process.env.GITHUB_REPOSITORY.split('/')[1];

    // Get the PR details using the GitHub API
    const response = await axios.get(`https://api.github.com/repos/${owner}/${repo}/pulls/${prNumber}`, {
        headers: {
            Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        },
    });

    // Extract the PR message
    const prMessage = response.data.body;

    // Read the existing JSON file
    const filePath = path.join(__dirname, 'mapping.json');
    const existingData = fs.existsSync(filePath) ? require(filePath) : [];

    // Append the PR message to the JSON file
    existingData.push({ prNumber, prMessage });

    // Write the updated JSON file
    fs.writeFileSync(filePath, JSON.stringify(existingData, null, 2));

    console.log('PR message appended to JSON file successfully.');
  } catch (error) {
    console.error('Error:', error.message || error);
    process.exit(1);
  }
}

run();
