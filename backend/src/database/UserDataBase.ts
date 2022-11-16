import { Account } from "../models/Account";
import { Transactions } from "../models/Transactions";
import { User } from "../models/user";
import { BaseDatabase } from "./BaseDatabase";


export class UserDataBase extends BaseDatabase {

    public createUser = async (user: User) => {
        await BaseDatabase.connection("Users")
        .insert({
            id: user.getId(),
            username: user.getusername(),
            password: user.getPassword(),
            accountId: user.getAccountId()
        })
    }
    public createAccount = async (account: Account) => {
        await BaseDatabase.connection("Accounts")
        .insert({
            id: account.getId(),
            balance: account.getBalance()
        })
    }

    public getUserByUsername = async (username: string) => {
        const result = await BaseDatabase.connection("Users")
        .select()
        .where({username})
        return result[0]
    }
    public getUserById = async (id: string) => {
        const result = await BaseDatabase.connection("Users")
        .select('username', 'password', "accountId", 'balance')
        .join("Accounts", 'accountId', '=', "Accounts.id")
        .where("Users.id", '=', `${id}`)

        return result[0]
    }
    public receiveBalance = async (id: string, value: number) => {
        const balance1 = await BaseDatabase.connection("Accounts")
        .select('balance')
        .where({id})
        const result = await BaseDatabase.connection("Accounts")
        .update({
            balance: balance1[0].balance + value
        })
        .where({id})
        return result
    }
    public payBalance = async (id: string, value: number) => {
        const balance1 = await BaseDatabase.connection("Accounts")
        .select('balance')
        .where({id})
        const result = await BaseDatabase.connection("Accounts")
        .update({
            balance: balance1[0].balance - value
        })
        .where({id})
        return result
    }

    public newTransaction = async (transaction: Transactions) => {
        await BaseDatabase.connection("Transactions")
        .insert({
            id: transaction.getId(),
            debitedAccountId: transaction.getDebitedAccountId(),
            creditedAccountId: transaction.getCreditedAccountId(),
            value: transaction.getValue(),
            createdAt: transaction.getCreatedAt()
        })
    }

    public getTransactions = async(id: string) => {
        const result = await BaseDatabase.connection.raw(
        `select * from Transactions 
        where debitedAccountId = '${id}'
        OR creditedAccountId = '${id}'
        `)
        
        return result[0]
    }
}