import { generateResponse } from "./responce.js";

const errorHandler = (handler) => {
    return async (req, res, next) => {
        try {
            await handler(req, res, next);
        } catch (error) {
            return res.status(400).json(generateResponse(error, { type: 'error' }));
        }
    };
};

export {errorHandler};