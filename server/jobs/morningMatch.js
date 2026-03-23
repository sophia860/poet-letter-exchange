const cron = require('node-cron');
const { runDailyMatching } = require('../services/matchingEngine');

/**
 * Schedule the daily matching job.
 * Runs at 6:00 AM UTC every day.
 * Adjust the cron expression for your target timezone.
 */
function scheduleMorningMatch() {
  cron.schedule('0 6 * * *', async () => {
    console.log('Running morning match job...');
    try {
      const matches = await runDailyMatching();
      console.log(`Morning match complete: ${matches.length} poets matched.`);
    } catch (err) {
      console.error('Morning match failed:', err);
    }
  }, {
    timezone: 'Europe/London'
  });

  console.log('Morning match job scheduled for 6:00 AM Europe/London.');
}

module.exports = { scheduleMorningMatch };
