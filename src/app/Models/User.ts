export class User{
    constructor(
        public userId:string,
        public name:string, 
        public emailId:string, 
        public createDateTime:string, 
        public lastModifiedDateTime:string,
    ) {}
}