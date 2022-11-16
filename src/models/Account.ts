


export class Account {
    constructor(
        private id: string,
        private balance: number,
    ) {}

    public getId = () => {
        return this.id
    }
    public getBalance = () => {
        return this.balance
    }
}