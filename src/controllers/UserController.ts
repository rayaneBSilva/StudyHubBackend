// Controller para gerenciar rotas dos Users
import { Request, Response } from 'express';
import { UserService } from '../services/UserService';

export class UserController {
    private userService: UserService;

    constructor() {
        this.userService = new UserService();
    }

    // GET /api/users - Listar todos os usuários
    getAllUsers = async (req: Request, res: Response): Promise<void> => {
        try {
            const users = await this.userService.getAllUsers();
            res.json({
                success: true,
                data: users,
                message: 'Usuários listados com sucesso'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : 'Erro interno do servidor'
            });
        }
    };

    // GET /api/users/:id - Buscar usuário por ID
    getUserById = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const user = await this.userService.getUserById(parseInt(id));
            
            res.json({
                success: true,
                data: user,
                message: 'Usuário encontrado com sucesso'
            });
        } catch (error) {
            const statusCode = error instanceof Error && error.message === 'Usuário não encontrado' ? 404 : 500;
            res.status(statusCode).json({
                success: false,
                message: error instanceof Error ? error.message : 'Erro interno do servidor'
            });
        }
    };

    // POST /api/users - Criar novo usuário
    createUser = async (req: Request, res: Response): Promise<void> => {
        try {
            const userData = req.body;
            const newUser = await this.userService.createUser(userData);
            
            res.status(201).json({
                success: true,
                data: newUser,
                message: 'Usuário criado com sucesso'
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error instanceof Error ? error.message : 'Erro na validação dos dados'
            });
        }
    };

    // PUT /api/users/:id - Atualizar usuário
    updateUser = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const userData = req.body;
            const updatedUser = await this.userService.updateUser(parseInt(id), userData);
            
            res.json({
                success: true,
                data: updatedUser,
                message: 'Usuário atualizado com sucesso'
            });
        } catch (error) {
            const statusCode = error instanceof Error && error.message.includes('não encontrado') ? 404 : 400;
            res.status(statusCode).json({
                success: false,
                message: error instanceof Error ? error.message : 'Erro na atualização'
            });
        }
    };

    // DELETE /api/users/:id - Deletar usuário
    deleteUser = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const result = await this.userService.deleteUser(parseInt(id));
            
            res.json({
                success: true,
                data: result,
                message: 'Usuário excluído com sucesso'
            });
        } catch (error) {
            const statusCode = error instanceof Error && error.message.includes('não encontrado') ? 404 : 500;
            res.status(statusCode).json({
                success: false,
                message: error instanceof Error ? error.message : 'Erro na exclusão'
            });
        }
    };

    // POST /api/users/login - Login de usuário
    loginUser = async (req: Request, res: Response): Promise<void> => {
        try {
            const { email, password } = req.body;
            const user = await this.userService.loginUser(email, password);
            
            res.json({
                success: true,
                data: user,
                message: 'Login realizado com sucesso'
            });
        } catch (error) {
            res.status(401).json({
                success: false,
                message: error instanceof Error ? error.message : 'Erro na autenticação'
            });
        }
    };
}