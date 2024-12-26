"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const restrictTo = (roles) => (req, res, next) => {
    try {
        const role = req.user.role;
        if (!roles.includes(role)) {
            return res.status(403).json({
                status: false,
                message: "Authorization unsucess."
            });
        }
        return next();
    }
    catch (_a) {
        return res.status(500).json({
            status: false,
            message: "Something went wrong."
        });
    }
};
exports.default = restrictTo;
