import cron from "node-cron";
import jwt from "jsonwebtoken";

const runMetricsInterval = async () => {
  console.log("Running task 20 seconds metrics interval");
  const token = jwt.sign(
    {
      sub: "cron-token",
    },
    process.env.CRON_SECRET_KEY || ""
  );

  await fetch(
    `${process.env.NEXT_PUBLIC_URL}/api/cron/20-seconds-metrics-interval?token=${token}`,
    {
      method: "GET",
    }
  );

  console.log("20 seconds metrics interval executed");
};

// every 20 seconds
cron.schedule("*/10 * * * * *", async () => {
  await runMetricsInterval();
});

const runChatInterval = async () => {
  console.log("Running task: AI decisions interval");
  const token = jwt.sign(
    {
      sub: "cron-token",
    },
    process.env.CRON_SECRET_KEY || ""
  );

  const sim = (process.env.SIM_TRADING || '').toLowerCase() === 'true';
  const url = sim
    ? `${process.env.NEXT_PUBLIC_URL}/api/model/chat`
    : `${process.env.NEXT_PUBLIC_URL}/api/cron/3-minutes-run-interval?token=${token}`;

  await fetch(url, { method: "GET" });
};

// every 1 minute for quicker testing
cron.schedule("* * * * *", async () => {
  await runChatInterval();
});

await runChatInterval();
