import {
  UseInterceptors,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs';
import { plainToClass } from 'class-transformer';
import { UserDto } from 'src/users/dtos/user.dto';

export class SerializeInterceptor implements NestInterceptor {
  //implements : create new class that satisfy all the requirements of an abstract class or interface
  intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
    return handler.handle().pipe(
      map((data: any) => {
        //run something before the response is sent out
        //plain to class turns the json response from the service into a class.
        //notice how the first argument is the dto we want to use a class template and the data. It also receives a set of options.
        return plainToClass(UserDto, data, {
          excludeExtraneousValues: true, //will expose only the properties that are with the expose decorator in the dto.
        });
      }),
    );
  }
}
