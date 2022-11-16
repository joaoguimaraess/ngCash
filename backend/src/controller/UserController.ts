import { Request, Response } from "express";
import { UserBusiness } from "../business/UserBusiness";
import { TransferInput, userInputDTO } from "../models/user";



export class UserController {

    constructor( private userBusiness: UserBusiness) {}

    public signUp = async (req: Request, res: Response) => {
        try {
            const input: userInputDTO = {
                username: req.body.username,
                password: req.body.password
            }
            const token = await this.userBusiness.signUp(input)
            res.status(200).send({token})
        } catch (error) {
            res.status(500).send({message: error.message})
        }
    }

    public login = async (req: Request, res: Response) => {
        try {
            const input: userInputDTO = {
                username: req.body.username,
                password: req.body.password
            }
            const token = await this.userBusiness.login(input)
            res.status(200).send({token})
        } catch (error) {
            res.status(500).send({message: error.message})
        }
    }

    public getProfileInfo = async (req: Request, res: Response) => {
        try {
            const token: string = req.headers.authorization
            const result = await this.userBusiness.getProfileInfo(token)
            res.status(200).send({result})
        } catch (error) {
            res.status(500).send({message: error.message})
        }
    }

    public newTransaction = async (req: Request, res: Response) => {
        try {
            const token: string = req.headers.authorization
            const input: TransferInput = {
                username: req.body.username,
                value: req.body.value,
                token
            }
            await this.userBusiness.newTransaction(input)
            res.status(200).send({message: "Transferência realizada com sucesso"})
        } catch (error) {
            res.status(500).send({message: error.message})
        }
    }

    public getTransactions = async (req: Request, res: Response) => {
        try {
            const token: string = req.headers.authorization
            const result = await this.userBusiness.getTransactions(token)
            res.status(200).send({result})
        } catch (error) {
            res.status(500).send({message: error.message})
        }
    }
}