import { ExecutionContext, Injectable } from "@nestjs/common";
import { AtStrategy } from "../strategies/at.strategy";
import { AuthGuard } from "@nestjs/passport";
import { Observable } from "rxjs";


@Injectable()
export class RtGuard extends AuthGuard('jwt-refresh'){
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        return super.canActivate(context)
    }
}