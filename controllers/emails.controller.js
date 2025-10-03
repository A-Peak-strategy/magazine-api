import * as emailService from "../services/emails.service.js";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validateEmailFormat = (email) => {
    if (!email || typeof email !== "string") return false;
    return emailRegex.test(email.trim());
};

export const getEmails = async (req, res) => {
    try {
        const emails = await emailService.getAllEmails();
        return res.json({ status: true, emails });
    } catch (err) {
        console.error("getEmails error:", err);
        return res.status(500).json({ status: false, error: "Server error" });
    }
};

export const addEmail = async (req, res) => {
    try {
        const { email } = req.body;
        if (!validateEmailFormat(email)) {
            return res
                .status(400)
                .json({ status: false, error: "Invalid email format" });
        }

        const exists = await emailService.hasEmail(email);
        if (exists) {
            return res
                .status(200)
                .json({
                    status: true,
                    added: false,
                    message: "Email already subscribed",
                });
        }

        const result = await emailService.addEmail(email);
        return res
            .status(201)
            .json({ status: true, added: result.added, emails: result.emails });
    } catch (err) {
        console.error("addEmail error:", err);
        return res.status(500).json({ status: false, error: "Server error" });
    }
};

export const removeEmail = async (req, res) => {
    try {
        const { email } = req.body;
        if (!validateEmailFormat(email)) {
            return res
                .status(400)
                .json({ status: false, error: "Invalid email format" });
        }

        const updated = await emailService.removeEmail(email);
        return res.json({ status: true, emails: updated });
    } catch (err) {
        console.error("removeEmail error:", err);
        return res.status(500).json({ status: false, error: "Server error" });
    }
};

export const checkEmail = async (req, res) => {
    try {
        const { email } = req.params;
        if (!validateEmailFormat(email)) {
            return res
                .status(400)
                .json({ status: false, error: "Invalid email format" });
        }
        const exists = await emailService.hasEmail(email);
        return res.json({ status: true, exists });
    } catch (err) {
        console.error("checkEmail error:", err);
        return res.status(500).json({ status: false, error: "Server error" });
    }
};
