import { Tests } from "@prisma/client";

export type ICreateNewTestData = Omit< Tests, "id" | "createdAt" >;