import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name:'custom_pipe',
    pure:true
})
export class customPipe implements PipeTransform{
    transform(value:string) {
        return value.replace('h','H')
    }
}