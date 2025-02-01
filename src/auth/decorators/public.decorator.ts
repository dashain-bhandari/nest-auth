import { createParamDecorator, ExecutionContext, SetMetadata } from "@nestjs/common";

export const Public = 
    () => 
       SetMetadata("isPublic", true)
    
