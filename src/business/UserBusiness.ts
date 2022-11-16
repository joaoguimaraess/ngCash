import { UserDataBase } from "../database/UserDataBase"
import { Account } from "../models/Account"
import { Transactions } from "../models/Transactions"
import { TransferInput, User, userInputDTO } from "../models/User"
import { Authenticator, ITokenPayload } from "../services/Authenticator"
import { HashManager } from "../services/HashManager"
import { IdGenerator } from "../services/idGenerator"


export class UserBusiness {
    constructor(
        private userDatabase: UserDataBase,
        private authenticator: Authenticator,
        private hashManager: HashManager,
        private idGenerator: IdGenerator
        
    ) 
    {}

    public signUp = async (input: userInputDTO ) => {
       
            const {username, password} = input
            let balance: number = 100
            if(username.length < 3) {
                throw new Error('O nome deve ter no mínimo três caracteres')
            }
            const checkingUser = await this.userDatabase.getUserByUsername(username)
            if(checkingUser) {
                throw new Error ('Este nome de usuário ja esta em uso!')
            }

            if(!password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$*&@#!.]).{8,}$/)) {
                throw new Error("sua senha deve conter no mínimo 8 caracteres, sendo: uma letra minúscula, uma letra maiúscula, um número e um caracter especial!")
            }
            if(!username || !password) {
                throw new Error('Todos parâmetros devem ser passados.')
            }
            const userId = this.idGenerator.generate()
            const accountId = this.idGenerator.generate()

            const hashedPassword: string = await this.hashManager.hash(password)

            const user = new User(
                userId,
                username,
                hashedPassword,
                accountId)
            
            const account = new Account(
                accountId,
                balance
            )

            await this.userDatabase.createAccount(account)
            await this.userDatabase.createUser(user)

            const payload: ITokenPayload = {
                id: user.getId()
            }
            const token = this.authenticator.generateToken(payload)
            
            return token
        
    }
    public login = async (input: userInputDTO) => {
        const {username, password} = input

        const user = await this.userDatabase.getUserByUsername(username)

        if(!user) {
            throw new Error("usuário inexistente.")
        }
        const correctPassword: boolean = await this.hashManager.compare(password, user.password)

        if(!correctPassword) {
            throw new Error("Senha incorreta.")
        }

        const payload: ITokenPayload = {
            id: user.id
        }

        const token = this.authenticator.generateToken(payload)

        return token
    }

    public getProfileInfo = async (token: string) => {

        if(!token) {
            throw new Error("Por favor, fornecer um token válido")
        }

        const payload = await this.authenticator.getTokenPayload(token)
        const user = await this.userDatabase.getUserById(payload.id)
        
        return user
    }

    public newTransaction = async (input: TransferInput) => {
        const {username, value, token} = input

        if(!username || !value || !token ) {
            throw new Error("falta parâmetros na sua requisição")
        }
        const userToPay = await this.userDatabase.getUserByUsername(username)

        if(!userToPay) {
            throw new Error("usuário inexistente.")
        }

        const payload = await this.authenticator.getTokenPayload(token)
        const user = await this.userDatabase.getUserById(payload.id)

        if(user.balance < value) {
            throw new Error("Não foi possível realizar sua transferência. Saldo insuficiente.")
        }
        if(userToPay.accountId === user.accountId ) {
            throw new Error("Não é possível transferir para você mesmo.")
        }
        const transactionId = this.idGenerator.generate()

        let data1 = new Date()
        let mes: string | number = data1.getMonth() + 1
        if(mes < 10) {
            mes = `0${mes}`
        }
        let dia: string | number = data1.getDate()
        if(dia < 10) {
            dia = `0${dia}`
        }
        const data = `${dia}/${mes}/${data1.getFullYear()}`

        await this.userDatabase.receiveBalance(userToPay.accountId, value)
        await this.userDatabase.payBalance(user.accountId, value)
        const transaction = new Transactions(
            transactionId,
            userToPay.accountId,
            user.accountId,
            value,
            data
        )

        await this.userDatabase.newTransaction(transaction)
    }
    public getTransactions = async (token: string) => {
        if(!token) {
            throw new Error("Por favor, fornecer um token válido")
        }

        const payload = await this.authenticator.getTokenPayload(token)
        const user = await this.userDatabase.getUserById(payload.id)
        const transactions = await this.userDatabase.getTransactions(user.accountId)
        if(transactions.length < 1) {
            return 'Nenhuma transferência até o momento.'
        }
        return transactions
    }
}