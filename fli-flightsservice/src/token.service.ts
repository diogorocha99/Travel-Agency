import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class TokenService {
    
    decodeToken(token: string): { id: string; role: string } | null {
        try {
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET) as { id: string; role: string };
            const { id, role } = decodedToken;
              return { id: id, role: role };
        } catch (error) {
            throw new UnauthorizedException(error)
         
        }
    }
}