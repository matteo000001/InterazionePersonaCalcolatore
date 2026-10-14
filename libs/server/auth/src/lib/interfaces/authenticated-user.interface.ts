import { UserRole } from '@exam-planner/shared-types';

export interface AuthenticatedUser {
    id: number;
    email: string;
    role: UserRole;
    name: string;
    managedDegreeProgramIds?: string[];
}
