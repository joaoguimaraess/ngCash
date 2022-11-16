import { Router } from "express"
import { UserBusiness } from "../business/UserBusiness"
import { UserController } from "../controller/UserController"
import { UserDataBase } from "../database/UserDataBase"
import { Authenticator } from "../services/Authenticator"
import { HashManager } from "../services/HashManager"
import { IdGenerator } from "../services/idGenerator"

export const userRouter = Router()

const userController = new UserController(
    new UserBusiness(
        new UserDataBase(),
        new Authenticator(),
        new HashManager(),
        new IdGenerator()
    )
)

userRouter.post('/signup', userController.signUp)
userRouter.post('/login', userController.login)
userRouter.get('/profile', userController.getProfileInfo)
userRouter.put('/pay', userController.newTransaction)
userRouter.get('/transactions', userController.getTransactions)