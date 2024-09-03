import express from 'express';
import axios from 'axios';
import puppeteer from 'puppeteer';

const app = express();

app.get('/', (req, res) => {
  res.send("Server is ready");
});

app.get('/api/ocean', async (req, res) => {
  try {
    // Launch the browser
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    // Navigate to the target website
    await page.goto('https://incois.gov.in/portal/osf/Alerts.html', { waitUntil: 'networkidle2' });

    // Wait for the specific table or container to load
    await page.waitForSelector('table'); // Adjust this selector based on the actual table's HTML

    // Extract the table data
    const tableData = await page.evaluate(() => {
      const rows = Array.from(document.querySelectorAll('table tr')); // Adjust the selector as necessary

      return rows.map(row => {
        const columns = Array.from(row.querySelectorAll('td')).map(column => column.innerText.trim());
        return columns;
      });
    });

    console.log('Extracted Table Data:', tableData);

    // Send the extracted data as a JSON response
    res.json(tableData);

    // Close the browser
    await browser.close();
  } catch (error) {
    console.error('An error occurred:', error.message);
    res.status(500).send('An error occurred while fetching the data.');
  }
});

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
