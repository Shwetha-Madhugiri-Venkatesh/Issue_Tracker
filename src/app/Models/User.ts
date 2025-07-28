export class User{
    constructor(
        public uname:string,
        public fname:string,
        public mname:string,
        public lname:string, 
        public created_source:string,
        public created_source_type:string,
        public created_datetime:Date,
        public company_code:string,
        public type:string,
        public user_id:string,
        public email_id:string,
        public phone:string, 
        public last_modified_source:string,
        public last_modified_source_type:string,
        public last_modified_datetime:Date,
        public address:string,
        public country:string,
        public state:string,
        public city:string,
        public postal_code:string,
        public locale:string,
        public time_zone:string,
        public password:string,
        public profile:any
    ) {}
}