import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UsersService } from './users.service'

@Injectable()
export class RoleMiddleware implements NestMiddleware {
  constructor(private readonly usersService: UsersService) {}
  
  use(req: Request, res: Response, next: NextFunction) {
    

    const token = req.headers.token.toString()

    const { id, role } = this.usersService.decodeToken(token) 

    
    if (role != 'Admin') {
      throw new UnauthorizedException("No Permission for this route")
    }


    next();
  }
}