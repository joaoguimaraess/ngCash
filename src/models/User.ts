
export interface userInputDTO {
    username: string,
    password: string
}
export interface TransferInput {
    username: string,
    value: number,
    token: string
}

export class User {
    constructor(
        private id: string,
        private username: string,
        private password: string,
        private accountId: string,
    ) {}

    public getId = () => {
        return this.id
    }
    public getusername = () => {
        return this.username
    }
    public getPassword = () => {
        return this.password
    }
    public getAccountId = () => {
        return this.accountId
    }
}