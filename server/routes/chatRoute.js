const express = require('express') ; 
const router = express.Router() ;
const {
    getChatHistory,
    markAsRead,
    getUnreadConversationsCount,
    getUserConversations
} = require('../Controllers/ChatController') ;

router.get('/unread-conversations-count/:userId' , getUnreadConversationsCount)
router.get('/conversations/:userId', getUserConversations);
router.get('/history/:user1/:user2' ,getChatHistory ) ; 
router.put('/read/:messageId/:userId', markAsRead);
module.exports = router ;