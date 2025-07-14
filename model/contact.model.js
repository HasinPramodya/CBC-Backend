

import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phoneNo: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    comment: {
        type: String,
        required: true
    }
});

const Contact = mongoose.model("Contact", contactSchema);

export default Contact;
