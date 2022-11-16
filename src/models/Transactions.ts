

export class Transactions {
    constructor(
        private id: string,
        private debitedAccountId: string,
        private creditedAccountId: string,
        private value: number,
        private createdAt: string,
    ) {}

    public getId = () => {
        return this.id
    }
    public getDebitedAccountId = () => {
        return this.debitedAccountId
    }
    public getCreditedAccountId = () => {
        return this.creditedAccountId
    }
    public getValue = () => {
        return this.value
    }
    public getCreatedAt = () => {
        return this.createdAt
    }
}