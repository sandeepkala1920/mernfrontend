const config = require('./config/env');
const { connectDB } = require('./config/mongo');
const app = require('./app');

const PORT = config.PORT;

const startServer = async () => {
  // Connect to Database
  await connectDB();

  // Start Express Server
  app.listen(PORT, () => {
    console.log(`🚀 IEM Admission Server running on: http://localhost:${PORT}`);
  });
};

startServer();

