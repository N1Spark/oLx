import { Request, Response } from 'express';
import { Role } from '../models/role-model.js';

export class RoleController {
    static async createRole(req: Request, res: Response): Promise<any>  {
        try {
            const role = await Role.create(req.body);
            res.status(201).json(role);
        } 
        catch (error) {
            res.status(500).json({ message: 'Failed to create role', error });
        }
    }

    static async getRoles(req: Request, res: Response): Promise<any>  {
        try {
            const roles = await Role.findAll();
            res.status(200).json(roles);
        } 
        catch (error) {
            res.status(500).json({ message: 'Failed to get roles', error });
        }
    }

    static async getRoleById(req: Request, res: Response): Promise<any>  {
        try {
            const { id } = req.params;
            const role = await Role.findByPk(id);
            if (!role)
                return res.status(404).json({ message: 'Role not found' });
            res.status(200).json(role);
        } 
        catch (error) {
            res.status(500).json({ message: 'Failed to get role', error });
        }
    }

    static async updateRole(req: Request, res: Response): Promise<any>  {
        try {
            const { id } = req.params;
            const { name, description } = req.body; 
            const role = await Role.findByPk(id);
            if (!role)
                return res.status(404).json({ message: 'Role not found' });
            await role.update({ name, description });
            res.status(200).json(role);
        } 
        catch (error) {
            res.status(500).json({ message: 'Failed to update role', error });
        }
    }

    static async deleteRole(req: Request, res: Response): Promise<any>  {
        try {
            const { id } = req.params;
            const role = await Role.findByPk(id);
            if (!role)
                return res.status(404).json({ message: 'Role not found' });
            await role.destroy();
            res.status(204).send();
        } 
        catch (error) {
            res.status(500).json({ message: 'Failed to delete role', error });
        }
    }
}
