import { Router } from 'express';

import * as usersController from '../controllers/usersController.js';

Router()
  .route('/')
  .get(usersController.getAllUsers)
  .post(usersController.createNewUser)
  .patch(usersController.updateUser)
  .delete(usersController.deleteUser);

export default Router;
