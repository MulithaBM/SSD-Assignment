const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const corsLogSchema = new Schema({
    origin: {
        type: String,
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('CorsLog', corsLogSchema);