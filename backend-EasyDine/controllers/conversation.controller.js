
const conversationService = require('../services/conversation.service');

const createConversation = async (req, res) => { 
    // user1_id, user2_id, "message", first user message -> user1 
    try {
        let conversationData = req.body; // object
        if (!conversationData) {
            return res.status(400).json({
                status: "error",
                message: "Bad request"
            });
        }
        await conversationService.createConversation(conversationData);
        return res.json({
            status: "success",
            message: "Conversation created successfully",
            data: conversationData
        });
    } catch(e) { 
        console.log("Error occured when create conversation");
        res.status(401).json({
            status: "error",
            message: "Error occured when create conversation",
        });
    }
};
module.exports = {
    createConversation
};