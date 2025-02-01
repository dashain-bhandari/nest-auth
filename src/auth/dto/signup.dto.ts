import { IsNotEmpty, MaxLength, MinLength } from "class-validator"
export class SignUpDto{
    @IsNotEmpty()
    email:string

    @IsNotEmpty()
    @MinLength(6)
    @MaxLength(8)
    password:string
}