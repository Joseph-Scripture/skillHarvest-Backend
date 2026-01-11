import { body } from "express-validator";

export const registerValidator = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Name is required"),

    body("email")
        .isEmail()
        .withMessage("Valid email is required"),

    body("password")
        .trim()
        .notEmpty().withMessage("Password is required")
        .isLength({ min: 8 }).withMessage("Password must be at least 8 characters long")
        .matches(/[A-Z]/).withMessage("Password must contain at least one uppercase letter")
        .matches(/[a-z]/).withMessage("Password must contain at least one lowercase letter")
        .matches(/\d/).withMessage("Password must contain at least one number")
        .matches(/[@$!%*?&-_#~`]/).withMessage("Password must contain at least one special character (@$!%*?&_#~`)"),
    body("farmLocation")
        .trim()
        .notEmpty()
        .withMessage("Farm location is required"),

    body("farmType")
        .trim()
        .notEmpty()
        .withMessage("Farm type is required"),

    body("gender")
        .trim()
        .notEmpty()
        .withMessage("Gender is required"),

    body("phoneNumber")
        .trim()
        .notEmpty()
        .withMessage("Phone number is required"),

    body("DateOfBirth")
        .trim()
        .notEmpty()
        .withMessage("Date of birth is required"),

    ];

export const loginValidator = [
    body("email")
        .isEmail()
        .withMessage("Valid email is required"),

    body("password")
        .notEmpty()
        .withMessage("Password is required"),
    body('')
];
