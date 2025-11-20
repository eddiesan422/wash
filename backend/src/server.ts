import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import router from './routes';
import { AppDataSource } from './config/data-source';
import { ensureAdminUser } from './services/user.service';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use('/api', router);

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 4000;

AppDataSource.initialize()
  .then(async () => {
    await ensureAdminUser();
    app.listen(PORT, () => {
      console.log(`API Biker Wash escuchando en el puerto ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Error iniciando la base de datos', err);
  });
