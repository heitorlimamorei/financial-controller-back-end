import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRouter from './routes/user.routes';

import { auth } from 'express-oauth2-jwt-bearer';

dotenv.config();

const checkJWT = auth({
  audience: process.env.AUTH0_IDENTIFIER,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
});

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/v1/user', checkJWT, userRouter);

app.use((err: Error, req: Request, res: Response) => {
  if (err.message) {
    const erro = err.message.split('-');
    const status = parseInt(erro[1]);
    const message = erro[0];
    console.error(err.stack);
    res.status(status).json({
      message: message,
    });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Server started on port ${process.env.PORT}`);
});
