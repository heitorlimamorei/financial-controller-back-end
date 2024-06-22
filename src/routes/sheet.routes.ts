import express from 'express';

import { db } from '../firebase/config';
import getSheetRepository from '../repositories/sheet.repository';
import getSheetService from '../services/sheet.service';
import getUserRepository from '../repositories/user.repository';
import getUserService from '../services/user.service';
import getSheetController from '../controllers/sheet.controller';

const repo = getSheetRepository(db);
const userRepo = getUserRepository(db);

const userService = getUserService(userRepo);
const service = getSheetService(repo, userService);

const controller = getSheetController(service);

const sheetRouter = express.Router();

sheetRouter.get('/:id', controller.Show);
sheetRouter.get('/:id/items', controller.ShowItems);
sheetRouter.get('/displaydata/:u', controller.ShowDisplayData);
sheetRouter.post('/verifytask', controller.VerifyTask);

export default sheetRouter;
