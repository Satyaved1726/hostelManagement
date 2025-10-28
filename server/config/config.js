const path = require('path');
const dotenv = require('dotenv');

// Load .env from current working directory first
dotenv.config();
const envVars = process.env;

// If critical vars not present (e.g. when running nodemon from server/), try root .env
if (!envVars.JWT_SECRET) {
    const rootEnv = path.join(__dirname, '../../.env');
    dotenv.config({ path: rootEnv });
}

// Refresh reference
const finalEnv = process.env;


module.exports = {
    port : finalEnv.PORT,
    env: finalEnv.NODE_ENV,
    mongo: {
        uri: finalEnv.MONGODB_URI,
        port: finalEnv.MONGO_PORT,
        isDebug: finalEnv.MONGOOSE_DEBUG
    },
    jwtSecret : finalEnv.JWT_SECRET
};