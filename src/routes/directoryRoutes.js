import { Router } from "express";
import { createDirectoryController, deleteDirectoryController, getDirectoryController, renameDirectoryController } from "../controller/directory.controller.js";


const directoryRouter = Router()

directoryRouter.post('/create' , createDirectoryController)
directoryRouter.patch("/:id" , renameDirectoryController)
directoryRouter.delete("/:id" , deleteDirectoryController)
directoryRouter.get("/", getDirectoryController)
directoryRouter.get("/:directoryId", getDirectoryController)

export default directoryRouter