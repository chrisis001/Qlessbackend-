const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/owner/stats', (req, res) => {
  res.json({
    totalOrders: 0,
    totalRevenue: 0,
    todayOrders: 0,
    todayRevenue: 0
  });
});

app.get('/', (req, res) => {
  res.send('QLESS API Iko Live');
});

app.listen(port, () => {
  console.log(`Server running`);
});
