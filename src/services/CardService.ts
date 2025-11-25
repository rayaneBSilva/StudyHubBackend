// Service para regras de negócio dos Cards
import { CardRepository } from '../repository/CardRepository';
import { CardAttributes, CardCreationAttributes } from '../models/Card';

export class CardService {
    private cardRepository: CardRepository;

    constructor() {
        this.cardRepository = new CardRepository();
    }

    // Listar todos os cards
    async getAllCards() {
        try {
            return await this.cardRepository.findAll();
        } catch (error) {
            throw new Error('Erro ao buscar cards');
        }
    }

    // Buscar card por ID
    async getCardById(id: number) {
        try {
            const card = await this.cardRepository.findById(id);
            if (!card) {
                throw new Error('Card não encontrado');
            }
            return card;
        } catch (error) {
            throw error;
        }
    }

    // Criar novo card
    async createCard(cardData: CardCreationAttributes) {
        try {
            // Validações de negócio
            if (!cardData.titulo || cardData.titulo.trim().length === 0) {
                throw new Error('Título é obrigatório');
            }
            
            if (!cardData.conteudo || cardData.conteudo.trim().length === 0) {
                throw new Error('Conteúdo é obrigatório');
            }

            if (!cardData.disciplina || cardData.disciplina.trim().length === 0) {
                throw new Error('Disciplina é obrigatória');
            }

            if (!cardData.autor_id) {
                throw new Error('Autor é obrigatório');
            }

            return await this.cardRepository.create(cardData);
        } catch (error) {
            throw error;
        }
    }

    // Atualizar card
    async updateCard(id: number, cardData: Partial<CardAttributes>) {
        try {
            const updatedCard = await this.cardRepository.update(id, cardData);
            if (!updatedCard) {
                throw new Error('Card não encontrado para atualização');
            }
            return updatedCard;
        } catch (error) {
            throw error;
        }
    }

    // Deletar card
    async deleteCard(id: number) {
        try {
            const deleted = await this.cardRepository.delete(id);
            if (!deleted) {
                throw new Error('Card não encontrado para exclusão');
            }
            return { message: 'Card excluído com sucesso' };
        } catch (error) {
            throw error;
        }
    }

    // Buscar cards por disciplina
    async getCardsByDisciplina(disciplina: string) {
        try {
            return await this.cardRepository.findByDisciplina(disciplina);
        } catch (error) {
            throw new Error('Erro ao buscar cards por disciplina');
        }
    }

    // Buscar cards por autor
    async getCardsByAutor(autor_id: number) {
        try {
            return await this.cardRepository.findByAutor(autor_id);
        } catch (error) {
            throw new Error('Erro ao buscar cards do autor');
        }
    }
}