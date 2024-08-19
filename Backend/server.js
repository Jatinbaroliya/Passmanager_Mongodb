const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import cors
const passwordRoutes = require('./routes/index');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Enable CORS
app.use(cors());

app.use(bodyParser.json());

// Connect to MongoDB
console.log(process.env.MONGO_URI);
mongoose.connect("mongodb://localhost:27017/jatin", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected...'))
.catch(err => console.log(err));

// Routes
app.use('/api/data', passwordRoutes);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
