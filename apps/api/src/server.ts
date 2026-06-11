import { app } from './app';
import dotenv from 'dotenv';

dotenv.config();

const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`API server listening at http://localhost:${port}`);
});
