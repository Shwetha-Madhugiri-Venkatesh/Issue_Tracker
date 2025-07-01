export class User{
    constructor(
        public userId:string,
        public name:string, 
        public emailId:string, 
        public created_source:string,
        public created_source_type:string,
        public createDateTime:string, 
        public last_modified_source:string,
        public last_modified_source_type:string,
        public last_Modified_DateTime:string,
    ) {}
}