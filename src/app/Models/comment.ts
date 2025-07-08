export class Comment{
    constructor(
        public commentId:string,
        public ticketId:string,
        public userId:string,
        public message:string,
    ){}
}