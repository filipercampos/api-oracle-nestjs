import { ExecutionContext } from '@nestjs/common';

export function handleAuthMock(context: ExecutionContext) {
  const request = context.switchToHttp().getRequest();
  const userAuthMock = {
    id: 1,
    cpf: '77444621063',
    profile: 'admin',
  };
  request.user = userAuthMock;
  return true;
}
