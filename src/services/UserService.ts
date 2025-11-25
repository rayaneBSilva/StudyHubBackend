// Service para regras de negócio dos Users
import { UserRepository } from '../repository/UserRepository';
import { UserAttributes, UserCreationAttributes } from '../models/User';

export class UserService {
    private userRepository: UserRepository;

    constructor() {
        this.userRepository = new UserRepository();
    }

    // Listar todos os usuários
    async getAllUsers() {
        try {
            return await this.userRepository.findAll();
        } catch (error) {
            throw new Error('Erro ao buscar usuários');
        }
    }

    // Buscar usuário por ID
    async getUserById(id: number) {
        try {
            const user = await this.userRepository.findById(id);
            if (!user) {
                throw new Error('Usuário não encontrado');
            }
            return user;
        } catch (error) {
            throw error;
        }
    }

    // Buscar usuário por email
    async getUserByEmail(email: string) {
        try {
            const user = await this.userRepository.findByEmail(email);
            if (!user) {
                throw new Error('Usuário não encontrado');
            }
            return user;
        } catch (error) {
            throw error;
        }
    }

    // Criar novo usuário
    async createUser(userData: UserCreationAttributes) {
        try {
            // Validações de negócio
            if (!userData.name || userData.name.trim().length === 0) {
                throw new Error('Nome é obrigatório');
            }

            if (!userData.email || userData.email.trim().length === 0) {
                throw new Error('Email é obrigatório');
            }

            // Validação simples de email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(userData.email)) {
                throw new Error('Email inválido');
            }

            if (!userData.password || userData.password.length < 6) {
                throw new Error('Senha deve ter pelo menos 6 caracteres');
            }

            // Verificar se email já existe
            const emailExists = await this.userRepository.emailExists(userData.email);
            if (emailExists) {
                throw new Error('Email já está em uso');
            }

            return await this.userRepository.create(userData);
        } catch (error) {
            throw error;
        }
    }

    // Atualizar usuário
    async updateUser(id: number, userData: Partial<UserAttributes>) {
        try {
            // Se estiver atualizando email, verificar se não existe
            if (userData.email) {
                const existingUser = await this.userRepository.findByEmail(userData.email);
                if (existingUser && existingUser.id !== id) {
                    throw new Error('Email já está em uso por outro usuário');
                }
            }

            const updatedUser = await this.userRepository.update(id, userData);
            if (!updatedUser) {
                throw new Error('Usuário não encontrado para atualização');
            }
            return updatedUser;
        } catch (error) {
            throw error;
        }
    }

    // Deletar usuário
    async deleteUser(id: number) {
        try {
            const deleted = await this.userRepository.delete(id);
            if (!deleted) {
                throw new Error('Usuário não encontrado para exclusão');
            }
            return { message: 'Usuário excluído com sucesso' };
        } catch (error) {
            throw error;
        }
    }

    // Login simples (sem hash de senha por simplicidade)
    async loginUser(email: string, password: string) {
        try {
            const user = await this.userRepository.findByEmail(email);
            if (!user) {
                throw new Error('Email ou senha inválidos');
            }

            // Em produção, você compararia com hash
            if (user.password !== password) {
                throw new Error('Email ou senha inválidos');
            }

            return user;
        } catch (error) {
            throw error;
        }
    }
}