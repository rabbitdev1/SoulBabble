export const generateApiKey = (length) => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let apiKey = "AP";
    for (let i = 0; i < length - 2; i++) {
        apiKey += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return apiKey;
};