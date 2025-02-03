// For Express.js backend
const cors = require('cors');
app.use(cors({
  origin: 'http://127.0.0.1:5500'  // Allow your local development server
}));
