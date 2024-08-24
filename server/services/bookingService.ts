
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getBookings() {
    return await prisma.bookings.findMany();
}