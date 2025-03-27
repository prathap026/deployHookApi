const cron = require('node-cron');
const axios = require('axios');
const List = require('./models/DeployHook');

const History=require('./models/deployHistory')

// Log every 1 minute
cron.schedule('* * * * *', () => {
    const now = new Date();
    console.log(`⏰ Current Time: ${now.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}`);
}, {
    timezone: "Asia/Kolkata"
});

// Trigger all deploy hooks every 15 minutes
cron.schedule('*/15 * * * *', async () => {
    console.log("⏳ Fetching all deploy hooks...");

    try {
        // Get all deploy hooks from MongoDB
        const hooks = await List.find({}).sort({ date: -1 });

        if (hooks.length === 0) {
            console.log("ℹ️ No deploy hooks found in database");
            return;
        }

        console.log(`🔍 Found ${hooks.length} deploy hooks to trigger`);

        // Trigger each hook sequentially
        for (const hook of hooks) {
            try {
                console.log(`🚀 Triggering deploy hook: ${hook.DeployHook}`);
                const response = await axios.get(hook.DeployHook);

               await History.create({
                    id:hook._id,
                    date:hook.date
                })

                console.log(`✅ Successfully triggered: ${hook.DeployHook}`);
                console.log(`📄 Response:`, response.data);
            } catch (error) {
                console.error(`❌ Failed to trigger ${hook.DeployHook}:`, error.message);
                // Continue with next hook even if one fails
            }
        }

        console.log("🎉 All deploy hooks processed");
    } catch (error) {
        console.error("❌ Error fetching deploy hooks from database:", error.message);
    }
}, {
    timezone: "Asia/Kolkata"
});

console.log("🚀 Cron jobs initialized:");
console.log("- Logging time every 1 minute");
console.log("- Triggering all deploy hooks every 15 minutes");