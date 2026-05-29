import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const template = JSON.parse(
  fs.readFileSync('./scripts/public/templates/postman-env.template.json'),
);

template.values = template.values.map((v) => {
  return {
    ...v,
    value: process.env[v.key] || v.value,
  };
});

fs.writeFileSync(
  './test/Stater-Backend-express-Env.postman_environment.json',
  JSON.stringify(template, null, 2),
);

console.log('Postman env synced with .env');
