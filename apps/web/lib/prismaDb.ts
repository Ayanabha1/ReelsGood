import { PrismaClient } from "@prisma/client";
import { prismaDBShared } from "@repo/database";

declare global {
  var prisma: PrismaClient | undefined;
}
const prismaDB = globalThis.prisma || prismaDBShared;
export default prismaDB;
