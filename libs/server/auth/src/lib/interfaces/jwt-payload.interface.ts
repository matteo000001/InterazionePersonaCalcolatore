import { UserRole } from '@exam-planner/shared-types';

export interface JwtPayload {
    sub: number;
    email: string;
    role: UserRole;
    name: string;
    managedDegreeProgramIds?: string[];
}
