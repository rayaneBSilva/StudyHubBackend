// Controller para gerenciar rotas dos Cards
import { Request, Response } from 'express';
import { CardService } from '../services/CardService';

export class CardController {
    private cardService: CardService;

    constructor() {
        this.cardService = new CardService();
    }

    // GET /api/cards - Listar todos os cards
    getAllCards = async (req: Request, res: Response): Promise<void> => {
        try {
            const cards = await this.cardService.getAllCards();
            res.json({
                success: true,
                data: cards,
                message: 'Cards listados com sucesso'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : 'Erro interno do servidor'
            });
        }
    };

    // GET /api/cards/:id - Buscar card por ID
    getCardById = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const card = await this.cardService.getCardById(parseInt(id));
            
            res.json({
                success: true,
                data: card,
                message: 'Card encontrado com sucesso'
            });
        } catch (error) {
            const statusCode = error instanceof Error && error.message === 'Card não encontrado' ? 404 : 500;
            res.status(statusCode).json({
                success: false,
                message: error instanceof Error ? error.message : 'Erro interno do servidor'
            });
        }
    };

    // POST /api/cards - Criar novo card
    createCard = async (req: Request, res: Response): Promise<void> => {
        try {
            const cardData = req.body;
            const newCard = await this.cardService.createCard(cardData);
            
            res.status(201).json({
                success: true,
                data: newCard,
                message: 'Card criado com sucesso'
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error instanceof Error ? error.message : 'Erro na validação dos dados'
            });
        }
    };

    // PUT /api/cards/:id - Atualizar card
    updateCard = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const cardData = req.body;
            const updatedCard = await this.cardService.updateCard(parseInt(id), cardData);
            
            res.json({
                success: true,
                data: updatedCard,
                message: 'Card atualizado com sucesso'
            });
        } catch (error) {
            const statusCode = error instanceof Error && error.message.includes('não encontrado') ? 404 : 400;
            res.status(statusCode).json({
                success: false,
                message: error instanceof Error ? error.message : 'Erro na atualização'
            });
        }
    };

    // DELETE /api/cards/:id - Deletar card
    deleteCard = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const result = await this.cardService.deleteCard(parseInt(id));
            
            res.json({
                success: true,
                data: result,
                message: 'Card excluído com sucesso'
            });
        } catch (error) {
            const statusCode = error instanceof Error && error.message.includes('não encontrado') ? 404 : 500;
            res.status(statusCode).json({
                success: false,
                message: error instanceof Error ? error.message : 'Erro na exclusão'
            });
        }
    };

    // GET /api/cards/disciplina/:disciplina - Buscar cards por disciplina
    getCardsByDisciplina = async (req: Request, res: Response): Promise<void> => {
        try {
            const { disciplina } = req.params;
            const cards = await this.cardService.getCardsByDisciplina(disciplina);
            
            res.json({
                success: true,
                data: cards,
                message: `Cards da disciplina ${disciplina} listados com sucesso`
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : 'Erro interno do servidor'
            });
        }
    };
}