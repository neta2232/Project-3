import express, { NextFunction, Request, response, Response } from 'express';
import { addVacation, deleteVacation, getVacationFollowers, getVacationsPaged, updateVacation } from '../services/vacationsService';
import { VacationsModel } from '../models/VacationsModel';
import fileUpload, { UploadedFile } from 'express-fileupload';
import { verifyTokenMW } from '../middlewares/verifyUserTokenMW';
import { verifyTokenAdminMW } from '../middlewares/verifyAdminTokenMW';
import { StatusCode } from '../models/StatusCode';

export const vacationsRoutes = express.Router();

vacationsRoutes.get('/vacations-paged', verifyTokenMW, async (req, res, next) => {
  const user = res.locals.user;
  if (!user?.id) {
    return res.status(401).send("User not authenticated or ID missing.");
  }

  const page = req.query.page ? Number(req.query.page) : 1;
  const limit = req.query.limit ? Number(req.query.limit) : 10;

  try {
    const vacations = await getVacationsPaged(
      page,
      limit,
      user.id,
      req.query.futureVacations === 'true',
      req.query.activeVacations === 'true',
      req.query.followedVacations === 'true'
    );
    res.status(200).json(vacations);
  } catch (err) {
    next(err);
  }
});

vacationsRoutes.get('/user-vacations', verifyTokenMW, async (req: Request, res: Response, next: NextFunction) => {
  const page = Number(req.query.page);
  const limit = Number(req.query.limit);
  const vacations = await getVacationsPaged(page || 1, limit || 10);
  res.status(StatusCode.Ok).json(vacations);
});

vacationsRoutes.post('/add-vacation', verifyTokenAdminMW, async (req: Request, res: Response, next: NextFunction) => {
  const uploadedFile = req.files?.image_fileName as UploadedFile;

  const newVacation = new VacationsModel(
    undefined,
    req.body.destination,
    req.body.description,
    new Date(req.body.start_date),
    new Date(req.body.end_date),
    +req.body.price,
    uploadedFile,
    req.body.followers || 0,
    req.body.is_following || false
  );

  newVacation.validate();

  const newId = await addVacation(newVacation);
  res.status(StatusCode.Created).send(newId);
})

vacationsRoutes.patch('/update-vacation', verifyTokenAdminMW, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const imageFile = req.files?.image_fileName as UploadedFile | undefined;

    const VacationUpdated = new VacationsModel(
      req.body.id,
      req.body.destination,
      req.body.description,
      req.body.start_date,
      req.body.end_date,
      req.body.price,
      imageFile || req.body.image_fileName,
      req.body.followers,
      req.body.isuserFollow ? req.body.isuserFollow : undefined
    );

    VacationUpdated.validate();
    const update = await updateVacation(VacationUpdated);
    res.status(StatusCode.Ok).send(update);
  } catch (err) {
    next(err);
  }
});

vacationsRoutes.delete('/delete-vacation', verifyTokenAdminMW, async (req: Request, res: Response, next: NextFunction) => {
  const vacationId = req.body.vacationId;
  const changes = await deleteVacation(vacationId);
  res.status(StatusCode.Ok).send(changes);
})

vacationsRoutes.get('/vacations-followers', verifyTokenAdminMW, async (req: Request, res: Response, next: NextFunction) => {
  const vacation_followers = await getVacationFollowers()
  res.status(StatusCode.Ok).send(vacation_followers)
})