const twilio = require ("twilio");
require('dotenv').config()

const twilioClient = twilio(process.env.SID, process.env.TOKEN);

module.exports ={ twilioClient}