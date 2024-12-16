import { Request, Response } from 'express';
import { User } from '../models/user-model.js';
import { Role } from '../models/role-model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export class UserController {
    static async createUser(req: Request, res: Response): Promise<any> {
        try {
            const { login, email, password, roleId } = req.body;
            if (!login || !email || !password || !roleId)
                return res.status(400).json({ message: 'Fill in all fields' });
            const saltRounds = 15;
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            const user = await User.create({ login, email, password: hashedPassword, roleId });
            res.status(201).json(user);
        }
        catch (error) {
            console.error('Error by creating users:', error);
            res.status(500).json({ message: 'Failed to create user', error });
        }
    }
    static async getUsers(req: Request, res: Response): Promise<any> {
        try {
            const users = await User.findAll({
                include: [{
                    model: Role, as: 'Role', attributes: ['name']
                }]
            });
            res.status(200).json(users);
        }
        catch (error) {
            console.error('Error by getting user data:', error);
            res.status(500).json({ message: 'Failed to get user', error });
        }
    }
    static async getUserById(req: Request, res: Response): Promise<any> {
        try {
            const { id } = req.params;
            const user = await User.findByPk(id, {
                include: [{
                    model: Role, as: 'Role', attributes: ['name']
                }]
            });
            if (!user)
                return res.status(404).json({ message: 'User not found' });
            res.status(200).json(user);
        }
        catch (error) {
            console.error('Error by getting user data:', error);
            res.status(500).json({ message: 'Failed to get user', error });
        }
    }
    static async updateUser(req: Request, res: Response): Promise<any> {
        try {
            const { id } = req.params;
            var { login, email, password, roleId } = req.body;
            const user = await User.findByPk(id);
            if (!user)
                return res.status(404).json({ message: 'User not found' });
            const saltRounds = 15;
            password = await bcrypt.hash(password, saltRounds);
            await user.update({ login, email, password, roleId });
            res.status(200).json(user);
        }
        catch (error) {
            console.error('Error by updating user data:', error);
            res.status(500).json({ message: 'Failed to update user', error });
        }
    }
    static async deleteUser(req: Request, res: Response): Promise<any> {
        try {
            const { id } = req.params;
            const user = await User.findByPk(id);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            await user.destroy();
            res.status(204).send();
        }
        catch (error) {
            console.error('Error by deleting user:', error);
            res.status(500).json({ message: 'Failed to delete user', error });
        }
    }
    static async login(req: Request, res: Response): Promise<any> {
        try {
            const { login, password } = req.body;
            const user = await User.findOne({ where: { login } });
            if (!user) {
                return res.status(400).json({ message: 'User not found' });
            }
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(400).json({ message: 'Incorrect password' });
            }
            const token = jwt.sign(
                { id: user.id, login: user.login, roleId: user.roleId },
                process.env.JWT_SECRET!,
                { expiresIn: '1h' }
            );
            res.status(200).json({ message: 'Authorization successful', token });
        }
        catch (error) {
            console.error('Authorization error:', error);
            res.status(500).json({ message: 'Failed to authorize user', error });
        }
    }
}
