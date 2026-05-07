import 'dotenv/config';
import express from './server/index.js';

const PORT = process.env.PORT;
const HOST = process.env.HOST;

express.listen(PORT, () => {
  console.log(`Server : http://${HOST}:${PORT}`);
  console.log(`Docs : http://${HOST}:${PORT}/docs`);
});
