const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const Conversation = require('../models/conversation.js')(sequelize, DataTypes);

// conversationData = {user1, user2, last_message_id = 0} . create tin nhan sau do update
async function createConversation(conversationData) {
    try {
        const conversation = new Conversation(conversationData);
        return conversation.save();
    } catch(e) {
        console.log('can not create conversation');
    }
}

module.exports = {
    createConversation
}