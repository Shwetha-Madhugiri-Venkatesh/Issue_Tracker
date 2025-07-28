export class Comment{
    constructor(
        public commented_person:string,
        public commentId:string,
        public ticketId:string,
        public userId:string,
        public message:string,
        public commented_date:Date,
        public last_modified_date:Date,
    ){}
}