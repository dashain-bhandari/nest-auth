import { PassportStrategy } from "@nestjs/passport"
import {Strategy} from "passport-local"
import { AuthService } from "../auth.service"

export class LocalStrategy extends PassportStrategy(Strategy){

    constructor(private authService:AuthService){super()}

    validate(email:string,password:string){
       return this.authService.signupLocal({email,password});
    }

}