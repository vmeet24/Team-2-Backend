import { Request, Response, Express } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import ITuitController from "../interfaces/ITuitController";
import ITuitDao from "../interfaces/ITuitDao";

export default class TuitController implements ITuitController {

    private app: Express;
    private tuitDao: ITuitDao;
    constructor(app: Express, tuitDao: ITuitDao) {
        this.app = app;
        this.tuitDao = tuitDao;
        this.app.get('/api/tuits', this.findAllTuits);
        this.app.get('/api/tuits/:tuitid', this.findTuitById);
        this.app.get('/api/users/:userid/tuits', this.findTuitsByUser);
        this.app.post('/api/users/:userid/tuits', this.createTuit);
        this.app.put('/api/tuits/:tuitid', this.updateTuit);
        this.app.delete('/api/tuits/:tuitid', this.deleteTuit);

        app.delete("/api/tuits/:uid/delete", this.deleteTuitByUserId);
    }


    findAllTuits = async (req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>): Promise<void> => {
        const tuits = await this.tuitDao.findAllTuits();
        res.json(tuits);
    }
    findTuitById = async (req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>): Promise<void> => {
        const tuit = await this.tuitDao.findTuitById(req.params.tuitid);
        res.json(tuit);
    }
    findTuitsByUser = async (req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>): Promise<void> => {
        const tuits = await this.tuitDao.findTuitsByUser(req.params.userid);
        res.json(tuits);
    }
    createTuit = async (req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>): Promise<void> => {
        const tuit = await this.tuitDao.createTuit(req.params.userid, req.body);
        res.json(tuit);
    }
    updateTuit = async (req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>): Promise<void> => {
        const tuit = await this.tuitDao.updateTuit(req.params.tuitid, req.body);
        res.json(tuit);
    }
    deleteTuit = async (req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>): Promise<void> => {
        const tuit = await this.tuitDao.deleteTuit(req.params.tuitid);
        res.json(tuit);
    }
    /**
     * @param {Request} req Represents request from client, including path
     * parameter uid identifying the primary key of the dummy user's tuit to be removed
     * @param {Response} res Represents response to client, including status
     * on whether deleting a tuit was successful or not
     */
    deleteTuitByUserId = async (req: Request, res: Response) => {
        const result = await this.tuitDao.deleteTuitByUserId(req.params.uid);
        res.json(result);
    }

}