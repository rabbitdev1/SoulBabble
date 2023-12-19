const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const journalRouter = require('./routes/journal');
const chatRoutes = require('./routes/chatbot');
const axios = require('axios');

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.use('/auth', authRoutes);
app.use('/journal', journalRouter);
app.use('/chatbot', chatRoutes);

app.post('/predict', async (req, res) => {
  try {
      const response = await axios.post('https://soulbabble-py-api-v6deafcxhq-uc.a.run.app/predict', req.body);
      res.json(response.data);
  } catch (error) {
      res.status(500).json({ error: 'Error forwarding request' });
  }
});

app.post('/predict/:sbuser_id', async (req, res) => {
  try {
      const response = await axios.post(`https://soulbabble-py-api-v6deafcxhq-uc.a.run.app/predict/${req.params.sbuser_id}`, req.body);
      res.json(response.data);
  } catch (error) {
      res.status(500).json({ error: 'Error forwarding request' });
  }
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
