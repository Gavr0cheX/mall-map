export class User {
    constructor (
      public id : number,
      public username: string,
      private _token: string,
      private tokenExpirationDate: Date,
      private _roles: any[]
    ) {}
  
    get token() {
      if(!this.tokenExpirationDate || this.tokenExpirationDate <= new Date()) {
        return null
      }
      return this._token
    }
  
    get roles() {
      if(this.token && (!this.tokenExpirationDate || this.tokenExpirationDate <= new Date())) {
        return null
      }
      return this._roles
    }
  }