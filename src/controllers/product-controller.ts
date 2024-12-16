import { Request, Response } from 'express';
import { Product } from '../models/product-model.js';
import { Op } from 'sequelize';

export class ProductController {
    static async createProduct(req: Request, res: Response) : Promise<any> {
        try {
            const { title, description, category, price, photos } = req.body;
            if (!title || !description || !category || !price)
                return res.status(400).json({ message: 'Fill in all required fields' });
            const product = await Product.create({ title, description, category, price, photos });
            res.status(201).json(product);
        } 
        catch (error) {
            console.error('Error creating product:', error);
            res.status(500).json({ message: 'Failed to create product', error });
        }
    }

    static async getProducts(req: Request, res: Response) : Promise<any> {
        try {
            const ads = await Product.findAll();
            res.status(200).json(ads);
        } 
        catch (error) {
            console.error('Error get products:', error);
            res.status(500).json({ message: 'Failed to get products', error });
        }
    }

    static async getProductById(req: Request, res: Response) : Promise<any> {
        try {
            const { id } = req.params;
            const product = await Product.findByPk(id);
            if (!product)
                return res.status(404).json({ message: 'Product not found' });
            res.status(200).json(product);
        } 
        catch (error) {
            console.error('Error get products:', error);
            res.status(500).json({ message: 'Failed to get products', error });
        }
    }

    static async updateProduct(req: Request, res: Response): Promise<any> {
        try {
            const { id } = req.params;
            const { title, description, category, price, photos } = req.body;
            const product = await Product.findByPk(id);
            if (!product)
                return res.status(404).json({ message: 'Product not found' });
            await product.update({ title, description, category, price, photos });
            res.status(200).json(product);
        } 
        catch (error) {
            console.error('Error updating product:', error);
            res.status(500).json({ message: 'Failed to update product', error });
        }
    }

    static async deleteProduct(req: Request, res: Response) : Promise<any> {
        try {
            const { id } = req.params;
            const product = await Product.findByPk(id);
            if (!product)
                return res.status(404).json({ message: 'Product not found' });
            await product.destroy();
            res.status(204).send();
        } 
        catch (error) {
            console.error('Error delete product:', error);
            res.status(500).json({ message: 'Failed to delete product', error });
        }
    }

    static async searchProducts(req: Request, res: Response) : Promise<any> {
        try {
            const { title, category, minPrice, maxPrice } = req.query;
            const whereConditions = [];
            if (title)
                whereConditions.push({ title: { [Op.like]: `%${title}%` } });
            if (category)
                whereConditions.push({ category: { [Op.like]: `%${category}%` } });
            if (minPrice)
                whereConditions.push({ price: { [Op.gte]: Number(minPrice) } });
            if (maxPrice)
                whereConditions.push({ price: { [Op.lte]: Number(maxPrice) } });
            const ads = await Product.findAll({
                where: {
                    [Op.and]: whereConditions
                },
            });
            if (ads.length === 0)
                return res.status(404).json({ message: 'Product not found' });
            res.status(200).json(ads);
        } 
        catch (error) {
            console.error('Error while searching product:', error);
            res.status(500).json({ message: 'Failed to search for product', error });
        }
    }
}
