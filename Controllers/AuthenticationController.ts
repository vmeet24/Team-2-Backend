import { Express, Request, Response } from "express";
import IUserDao from "../interfaces/IUserDao";

const bcrypt = require('bcrypt');
const saltRounds = 10;

const AuthenticationController = (app: Express, userDao: IUserDao) => {

  const login = async (req: Request, res: Response) => {

    const user = req.body;
    const username = user.username;
    const password = user.password;
    const existingUser = await userDao.findUserByUsername(username);


    if (!existingUser) {
      res.sendStatus(403);
      return;
    }

    const match = await bcrypt
      .compare(password, existingUser.password);

    if (match) {
      existingUser.password = '*****';
      req.session['profile'] = existingUser;
      res.json(existingUser);
    } else {
      res.sendStatus(403);
    }
  };

  const signup = async (req: Request, res: Response) => {
    const newUser = req.body;
    const password = newUser.password;
    const hash = await bcrypt.hash(password, saltRounds);
    newUser.password = hash;

    const existingUser = await userDao
      .findUserByUsername(req.body.username);
    if (existingUser) {
      res.sendStatus(403);
      return;
    } else {
      const insertedUser = await userDao
        .createUser(newUser);
      insertedUser.password = '';
      req.session['profile'] = insertedUser;
      res.json(insertedUser);
    }
  }

  const profile = (req: Request, res: Response) => {
    const profile = req.session['profile'];
    if (profile) {
      profile.password = "";
      res.json(profile);
    } else {
      res.sendStatus(403);
    }
  }

  const logout = (req: Request, res: Response) => {
    req.session.destroy((error) => {
      if (error) {
        console.log(error)
      }
    });
    res.sendStatus(200);
  }

  app.post("/api/auth/login", login);
  app.post("/api/auth/profile", profile);
  app.post("/api/auth/logout", logout);
  app.post("/api/auth/signup", signup);
}

export default AuthenticationController;

