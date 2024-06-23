import express from 'express';

import FeedbackController from '../controllers/feedback.controller';
import { db } from '../firebase/config';
import FeedbackRepository from '../repositories/feedback.repository';
import getUserRepository from '../repositories/user.repository';
import FeedbackService from '../services/feedback.service';
import getUserService from '../services/user.service';
import sanitilizeArrayData from '../utils/dataFunctions';

const repository = new FeedbackRepository(db, sanitilizeArrayData);

const userRepo = getUserRepository(db);
const userSvc = getUserService(userRepo);

const service = new FeedbackService(userSvc, repository);
const controller = new FeedbackController(service);

const feedbackRouter = express.Router();

feedbackRouter.get('/', controller.Index);
feedbackRouter.get('/find', controller.Show);
feedbackRouter.post('/', controller.Create);

export default feedbackRouter;
