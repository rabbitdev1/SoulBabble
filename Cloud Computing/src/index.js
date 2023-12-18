const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const journalRouter = require('./routes/journal');
const chatRoutes = require('./routes/chatbot');


const app = express();
const port = 3000;

app.use(bodyParser.json());

app.use('/auth', authRoutes);
app.use('/journal', journalRouter);
app.use('/chatbot', chatRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
