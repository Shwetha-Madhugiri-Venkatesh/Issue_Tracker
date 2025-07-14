export class Ticket{
    constructor(
        public reporter_name:string,
        public ticketId:string, 
        public categoryId:string, 
        public subCategoryId:string,
        public type:string, 
        public assigneeId:string, 
        public reportedId:string, 
        public subject:string, 
        public description:string, 
        public statusId:string, 
        public priorityId:string, 
        public createDateTime:string, 
        public lastModifiedDateTime:string,
        public input_file:any,
        public browser:string,
        public operatingSystem:string,
    ){}
}