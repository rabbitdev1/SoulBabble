export const timezoneMiddleware = (req, res, next) => {
    const clientTimezone = req.get("Client-Timezone");
    if (clientTimezone) {
        req.clientTimezone = clientTimezone;
    }
    next();
};
