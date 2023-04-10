import {
CanActivate, ExecutionContext
} from '@nestjs/common'
import { Observable } from 'rxjs'

export class AuthGuard implements CanActivate{
    //execution context : Interface describing details about the current request pipeline.
    canActivate(context: ExecutionContext){
        const request = context.switchToHttp().getRequest()
/* The canActivate() method extracts the incoming request object from the context parameter using the switchToHttp() method, and then retrieves the userId property from the request session object */
        return request.session.userId;
    }
}