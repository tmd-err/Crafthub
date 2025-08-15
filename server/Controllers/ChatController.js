const Message = require("../Models/Schemas/Message") ;
const mongoose = require('mongoose');
const User = require("../Models/Schemas/User") ;
const chatSocketHandler = (io) => {
  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Join a room using user ID
    socket.on('join', (userId) => {
      socket.join(userId);
      console.log(`User ${userId} joined room`);
    });

    // Handle sending messages
    socket.on('sendMessage', async ({ senderId, receiverId, content }) => {
      try {
        const newMessage = new Message({ sender: senderId, receiver: receiverId, content });
        const savedMessage = await newMessage.save();

        // Emit to receiver's room
        io.to(receiverId).emit('receiveMessage', savedMessage);
        socket.emit('messageSent', savedMessage); // Optional confirmation
      } catch (error) {
        console.error('Message send error:', error);
        socket.emit('errorMessage', 'Message could not be sent');
      }
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });
};
const getChatHistory = async (req, res) => {
    const { user1, user2 } = req.params;
  
    try {
      const messages = await Message.find({
        $or: [
          { sender: user1, receiver: user2 },
          { sender: user2, receiver: user1 }
        ]
      }).sort({ sentAt: 1 }); // Sort by oldest first
  
      res.json(messages);
    } catch (error) {
      console.error('Error fetching chat history:', error);
      res.status(500).json({ message: 'Failed to load chat history' });
    }
  };
  const markAsRead = async (req, res) => {
    try {
      const { messageId ,userId} = req.params;
      
      const message = await Message.findById(messageId);
    
      if (!message) {
        return res.status(404).json({ message: 'Message not found' });
      }
    
      // Check if the user is the receiver of the message
      if (message.receiver.toString() == userId) {
              // Mark the message as read if the user is the receiver
          message.read = true;
          await message.save();
      }
    

    
      return res.status(200).json({ message: 'Message marked as read', message });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  
const getUnreadConversationsCount = async (req, res) => {
  try {
    const {userId} = req.params; // assuming you're using middleware to attach the logged-in user
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }
    const result = await Message.aggregate([
      {
        $match: {
          receiver: new mongoose.Types.ObjectId(userId),
          read: false
        }
      },
      {
        $group: {
          _id: "$conversationId"
        }
      },
      {
        $count: "unreadConversations"
      }
    ]);

    const count = result[0]?.unreadConversations || 0;

    res.status(200).json({ unreadConversations: count });
  } catch (err) {
    console.error("Error fetching unread conversations count:", err);
    res.status(500).json({ message: "Server error" });
  }
};
const getUserConversations = async (req, res) => {
  const { userId } = req.params;

 try {
  const objectId = new mongoose.Types.ObjectId(userId);

  const conversations = await Message.aggregate([
    {
      $match: {
        $or: [
          { sender: objectId },
          { receiver: objectId }
        ]
      }
    },
    {
      $sort: { sentAt: -1 }
    },
    {
      $group: {
        _id: {
          $cond: [
            { $lt: ['$sender', '$receiver'] },
            ['$sender', '$receiver'],
            ['$receiver', '$sender']
          ]
        },
        lastMessage: { $first: '$$ROOT' }
      }
    },
    {
      $replaceRoot: {
        newRoot: '$lastMessage'
      }
    },
    {
      $addFields: {
        otherUser: {
          $cond: [
            { $eq: ['$sender', objectId] },
            '$receiver',
            '$sender'
          ]
        }
      }
    },
    {
      $lookup: {
        from: 'users',
        localField: 'otherUser',
        foreignField: '_id',
        as: 'otherUserInfo',
        pipeline: [
          { $project: { username: 1, profilePicture: 1 } }
        ]
      }
    },
    {
      $unwind: {
        path: '$otherUserInfo',
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $sort: { sentAt: -1 }
    }
  ]);
  
  
  

  res.status(200).json(conversations);
} catch (error) {
  console.error('Error fetching user conversations:', error);
  res.status(500).json({ message: 'Server error' });
}

};
module.exports = {
    chatSocketHandler ,
    getChatHistory ,
    markAsRead,
    getUnreadConversationsCount ,
    getUserConversations
};
