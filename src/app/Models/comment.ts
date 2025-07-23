export class Comment{
    constructor(
        public commentId:string,
        public ticketId:string,
        public userId:string,
        public message:string,
        // public created_date:string,
        // public last_modified_date:string
    ){}
}