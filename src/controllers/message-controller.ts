import { Request, Response } from 'express';
import Message from '../models/message-model.js';
import { Op } from 'sequelize';

export default class MessageController {
    static async sendMessage(req: Request, res: Response): Promise<any> {
        try {
            const { senderId, recipientId, productId, content } = req.body;
            if (!senderId || !recipientId || !productId || !content)
                return res.status(400).json({ message: 'Fill in all required fields' });
            const message = await Message.create({
                senderId,
                recipientId,
                productId,
                content,
            });
            res.status(201).json({ message: 'The message was successfully sent', data: message });
        }
        catch (error) {
            console.error('Error when sending message:', error);
            res.status(500).json({ message: 'Failed to send message', error });
        }
    }

    static async getMessages(req: Request, res: Response): Promise<any> {
        try {
            const { userId, chatPartnerId, productId } = req.query;

            if (!userId || !chatPartnerId || !productId)
                return res.status(400).json({ message: "userId, chatPartnerId and productId required" });
            const adIdNumber = parseInt(productId as string, 10);
            const userIdString = userId as string;
            const chatPartnerIdString = chatPartnerId as string;
            if (isNaN(adIdNumber))
                return res.status(400).json({ message: "productId must be number type" });
            const messages = await Message.findAll({
                where: {
                    productId: adIdNumber,
                    [Op.or]: [
                        { senderId: userIdString, recipientId: chatPartnerIdString },
                        { senderId: chatPartnerIdString, recipientId: userIdString },
                    ],
                },
                order: [["createdAt", "ASC"]],
            });
            res.status(200).json({ messages });
        }
        catch (error) {
            console.error("Error when getting message:", error);
            res.status(500).json({ message: "Failed to get message", error });
        }
    }

    static async markAsRead(req: Request, res: Response): Promise<any> {
        try {
            const { messageId } = req.params;
            const message = await Message.findByPk(messageId);
            if (!message)
                return res.status(404).json({ message: 'Message not found' });
            message.isRead = true;
            await message.save();
            res.status(200).json({ message: 'Message marked as read' });
        }
        catch (error) {
            console.error('Error when updating the message status:', error);
            res.status(500).json({ message: 'Failed to update message status', error });
        }
    }
}
