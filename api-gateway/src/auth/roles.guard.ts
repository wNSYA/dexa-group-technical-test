// api-gateway/src/roles.guard.ts
import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 1. Read the roles required by the route's @Roles() decorator
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    
    // 2. If no roles are explicitly required, let them through
    if (!requiredRoles) {
      return true;
    }

    // 3. Grab the user object attached by the AuthGuard
    const { user } = context.switchToHttp().getRequest();

    if (!user || !user.role) {
      throw new ForbiddenException('User role not found');
    }

    // 4. Check if the user's role matches any of the required roles
    const hasRole = requiredRoles.includes(user.role);

    if (!hasRole) {
      throw new ForbiddenException(`Access denied for role: ${user.role}`);
    }

    return true;
  }
}