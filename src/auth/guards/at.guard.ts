import { ExecutionContext, Injectable } from "@nestjs/common";
import { AtStrategy } from "../strategies/at.strategy";
import { AuthGuard } from "@nestjs/passport";
import { Observable } from "rxjs";
import { Reflector } from "@nestjs/core";


@Injectable()
export class AtGuard extends AuthGuard('jwt'){

    constructor(private reflector:Reflector){
        super()
    }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        if(this.reflector.getAllAndOverride("isPublic",[context.getHandler(),context.getClass()]))
        {
            return true;

        }
        return super.canActivate(context);
    }
}