
import cors from 'cors';
import express from 'express';
import swaggerUi from 'swagger-ui-express';

import { router } from './routes/route';
import swaggerSpec from './config/swagger';
import path from 'path';

export const app = express();
app.use(cors());

const PORT = process.env.PORT ;

app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Servir les fichiers statiques du dossier uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/', router);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Swagger docs at http://localhost:${PORT}/api-docs`);
});
