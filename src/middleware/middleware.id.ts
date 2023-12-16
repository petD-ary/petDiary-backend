import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const IdFromJwt = createParamDecorator(
  (_, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    return request.user.id;
  },
);
