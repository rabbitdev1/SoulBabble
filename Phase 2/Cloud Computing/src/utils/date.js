export const formatDate = (dateString) => {
    const [day, month, year] = dateString.split('-');
    return new Date(`${year}-${month}-${day}`);
};

export const adjustStartOfDay = (date) => {
    date.setHours(0, 0, 0, 0);
    return date;
};

export const adjustEndOfDay = (date) => {
    date.setHours(23, 59, 59, 999);
    return date;
};
