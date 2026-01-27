import mongoose from "mongoose";

export const toObjectId = (id) => {
    if (!id) return null;
    // Check if it's a valid 24-character hex string
    if (typeof id === 'string' && id.length === 24 && /^[0-9a-fA-F]{24}$/.test(id)) {
        return new mongoose.Types.ObjectId(id);
    }
    return null;
};
