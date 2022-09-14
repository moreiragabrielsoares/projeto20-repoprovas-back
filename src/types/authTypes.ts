import { Users } from '@prisma/client';
import { Sessions } from '@prisma/client';


export type INewUserData = Omit< Users & { confirmPassword: string }, "id" | "createdAt" >;

export type ICreateNewUserData = Omit< Users, "id" | "createdAt" >;

export type ILoginUserData = Omit< Users, "id" | "createdAt" >;

export type ICreateNewSession = Omit< Sessions, "id" | "createdAt" >;
