import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '@exam-planner/server-users';
import type { AuthenticatedUser } from '../interfaces/authenticated-user.interface';
import type { JwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
    const secret = process.env.SECRET_KEY ?? 'dev-secret-change-me';
    if(!secret){
      throw new Error('SECRET_KEY not defined yet')
    }
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  async validate(payload: JwtPayload): Promise<AuthenticatedUser> {
    const user = await this.usersService.getById(payload.sub);
    const { passwordHash, ...authenticatedUser } = user;

    return {
      ...authenticatedUser,
      managedDegreeProgramIds: authenticatedUser.managedDegreeProgramIds ?? [],
    };
  }
}
