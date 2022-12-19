import logger from "pino";

// creates a logger instance
const logs = logger({
  // does not include the process id in the logs
  base: { pid: false },
  // sets the transport and options for pretty printing the logs
  transport: {
    target: "pino-pretty",
    options: {
      colorized: true,
    },
  },
  // adds a timestamp to each log message
  timestamp: () => `,"time": "${new Date().toLocaleString()}"`,
});

export default logs;
