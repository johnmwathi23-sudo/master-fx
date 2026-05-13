import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';

@Injectable()
export class RolesGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) throw new ForbiddenException('Access denied');

    const requiredRoles = this.reflectRoles(context);
    if (!requiredRoles || requiredRoles.length === 0) return true;

    const hasRole = requiredRoles.some(role => user.role === role);
    if (!hasRole) throw new ForbiddenException('Insufficient permissions');

    return true;
  }

  private reflectRoles(context: ExecutionContext): string[] {
    const handler = context.getHandler();
    const classRef = context.getClass();
    const roles = Reflect.getMetadata('roles', handler) || Reflect.getMetadata('roles', classRef) || [];
    return roles;
  }
}
