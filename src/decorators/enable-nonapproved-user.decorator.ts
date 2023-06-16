import { SetMetadata } from '@nestjs/common';

export const ENABLE_NON_APPROVED_USER = 'EnableNonApprovedUser';
export const EnableNonApprovedUser = () =>
  SetMetadata(ENABLE_NON_APPROVED_USER, true);
