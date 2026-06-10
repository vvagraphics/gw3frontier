const cron = require('node-cron');
const { exec } = require('child_process');
const path = require('path');

// Point to your Java scraper directory
const scraperDir = path.join(__dirname, '../scraper');

console.log("🟢 Auto-Scraper initialized. Standing by for scheduled execution...");

// Function to run the Maven command
const runJavaScraper = () => {
    console.log(`\n[${new Date().toLocaleTimeString()}] 🚀 Launching GW3FRONTIER Java Engine...`);
    
    // We only need to run exec:java since we already compiled it previously
    exec('mvn exec:java -Dexec.mainClass="com.gw3frontier.scraper.NewsScraper"', { cwd: scraperDir }, (error, stdout, stderr) => {
        if (error) {
            console.error(`❌ Scraper Error: ${error.message}`);
            return;
        }
        if (stderr && !stderr.includes("WARNING")) {
            console.error(`⚠️ Scraper Stderr: ${stderr}`);
        }
        console.log(`✅ Scraper execution complete. Data synced.`);
    });
};

// --- SCHEDULE SETUP ---
// This cron expression translates to: "Run at minute 0 past every 6th hour"
// (e.g., 12:00 AM, 6:00 AM, 12:00 PM, 6:00 PM)
cron.schedule('0 */6 * * *', () => {
    runJavaScraper();
});

// Run it once immediately when you boot up the server so data is always fresh
runJavaScraper();