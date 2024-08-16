export const useGlobalFunction = () => {

    function toDatetimeLocal(date: any) {
        const newDate: any = new Date(date);
        const tzOffset = newDate.getTimezoneOffset() * 60000; // offset in milliseconds
        const localISOTime = new Date(newDate - tzOffset).toISOString().slice(0, 16);
        return localISOTime;
    }

    function toDateLocal(date: any) {
        const newDate: any = new Date(date);
        const tzOffset = newDate.getTimezoneOffset() * 60000; // offset in milliseconds
        const localISOTime = new Date(newDate - tzOffset).toISOString().slice(0, 10);
        return localISOTime;
    }

    return { toDatetimeLocal, toDateLocal }
}