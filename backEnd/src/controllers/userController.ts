import express, { NextFunction, Request, response, Response } from 'express';
import { addVacation, deleteVacation, getVacationsPaged, updateVacation } from '../services/vacationsService';
import { VacationsModel } from '../models/VacationsModel';
import { UserModel } from '../models/UserModel';
import { createUser, login } from '../services/userServices';
import { StatusCode } from '../models/StatusCode';
import { followVacation, unfollowVacation } from '../services/followersService';
import { verifyTokenMW } from '../middlewares/verifyUserTokenMW';

export const userRoutes = express.Router();

userRoutes.post('/user-register', async (req: Request, res: Response, next: NextFunction) => {

const { first_name, last_name, email, password_hash, isadmin } = req.body;
const user = new UserModel(undefined, first_name, last_name, email, password_hash, false);
        const token = await createUser(user);
        res.status(StatusCode.Created).json({token: token});
  
});

userRoutes.post('/user-login', async (req: Request, res: Response, next: NextFunction) => {
    const {email, password} = req.body;
    const user = await login(email, password);
     res.status(StatusCode.Ok).json(user);

})


userRoutes.post('/follow-vacation', verifyTokenMW, async (req: Request, res: Response, next: NextFunction) => {
    const {user_id, vacation_id} = req.body;
    const follow = await followVacation(user_id, vacation_id);
     res.status(StatusCode.Ok).json(follow);

})
userRoutes.delete('/unfollow-vacation', verifyTokenMW, async (req: Request, res: Response, next: NextFunction) => {
    const {user_id, vacation_id} = req.body;
    const unfollow = await unfollowVacation(user_id, vacation_id);
     res.status(StatusCode.Ok).json(unfollow);

})