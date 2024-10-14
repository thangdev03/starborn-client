export const createUTCDate = (timestamp) => {
    const timestampDate = new Date(timestamp);

    const d = new Date();
    d.setUTCFullYear(timestampDate.getFullYear());
    d.setUTCMonth(timestampDate.getMonth());
    d.setUTCDate(timestampDate.getDate());
    d.setUTCHours(timestampDate.getHours());
    d.setUTCMinutes(timestampDate.getMinutes());

    return d;
}