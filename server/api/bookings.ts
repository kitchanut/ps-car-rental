import { getBookings } from '~/server/services/bookingService';

export default defineEventHandler(async (event) => {
    if (event.req.method === 'GET') {
        return await getBookings();
    }

});