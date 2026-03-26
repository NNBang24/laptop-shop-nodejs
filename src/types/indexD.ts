// file indexD.ts = > D day la dataTypes
import { User as PrismaUser, Role } from "@prisma/client";

declare global {
    namespace Express {
        interface User extends Omit<PrismaUser, "password"> {
            role?: Role ;
            sumCart? : number ;
        }
    }
}