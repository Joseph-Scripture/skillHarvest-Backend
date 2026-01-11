import rateLimit from "express-rate-limit";

export const authLimit = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: "Too many requests from this IP, please try again after 15 minutes"
});

export const videoUploadLimit = rateLimit({
    windowMs: 24 * 60 * 60 * 1000,
    max: 10,
    message: "Too many video uploads from this IP, please try again after 24 hours"
});

export const commentLimit = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: "Too many comments from this IP, please try again after 15 minutes"
});

export const bookmarkLimit = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: "Too many bookmarks from this IP, please try again after 15 minutes"
});

export const ratingLimit = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: "Too many ratings from this IP, please try again after 15 minutes"
});
export const passwordResetLimit = rateLimit({
    windowMs: 10 * 60* 1000,
    max:3,
    message:"Too many request from this IP, please try after 10 minutes"
})
