// models/DeployHook.js
const mongoose = require('mongoose');

const ListSchema = new mongoose.Schema({
    DeployHook: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('DeployHook', ListSchema);