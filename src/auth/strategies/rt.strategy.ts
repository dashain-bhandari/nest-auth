import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { Strategy,ExtractJwt } from "passport-jwt";

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy,"jwt-refresh"){
constructor(){super(
    {
    jwtFromRequest:ExtractJwt.fromAuthHeaderAsBearerToken(),
    ignoreExpiration:false,
    secretOrKey:'rt-secret',
    passReqToCallback:true
    }
)}

validate(req:Request,payload:any){
    console.log(payload)
    const refreshToken=req.get("authorization").replace("Bearer","").trim()
    return {data:payload,refreshToken}
}

}