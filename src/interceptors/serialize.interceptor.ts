import {
  UseInterceptors,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs';
import { plainToClass, plainToInstance } from 'class-transformer';

export function Serialize(dto: any) {
  return UseInterceptors(new SerializeInterceptor(dto));
} //here i am creating a function that uses the class below
//functions can be used as decorators.
//remember that decorators are functions that wraps a method or a class and add extra functionality
//they can intercept incoming data and also modify the returning response
//inside of a decorator you normally call the method or class to which the decorator is applied
// that call which is done inside the decorator function can receive a different argument and also, its response can be modified before sending out of the decorator as a response from the method call.

export class SerializeInterceptor implements NestInterceptor {
  //implements : create new class that satisfy all the requirements of an abstract class or interface
  constructor(private dto: any) {}
  intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
    return handler.handle().pipe(
      map((data: any) => {
        //run something before the response is sent out
        //plain to class turns the json response from the service into a class.
        //notice how the first argument is the dto we want to use a class template and the data. It also receives a set of options.
        return plainToInstance(this.dto, data, {
          excludeExtraneousValues: true, //will expose only the properties that are with the expose decorator in the dto.
        });
      }),
    );
  }
}
