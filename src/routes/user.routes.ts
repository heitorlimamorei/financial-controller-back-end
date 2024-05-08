import express from 'express';

import { db } from '../firebase/config';

import getUserController from '../controllers/user.controller';
import getUserService from '../services/user.service';
import getUserRepository from '../repositories/user.repository';

const repo = getUserRepository(db);
const service = getUserService(repo);
const controller = getUserController(service);

const userRouter = express.Router();

userRouter.post('/', controller.Create);
userRouter.get('/', controller.Show);
userRouter.delete('/:id', controller.Delete);
userRouter.put('/', controller.Update);
userRouter.patch('/sheetids', controller.AddSheetId);
userRouter.patch('/sheetids/remove', controller.RemoveSheetId);

export default userRouter;
