// Repository para operações de Card no banco de dados
import { Card, CardAttributes, CardCreationAttributes } from '../models/Card';

export class CardRepository {
    // Buscar todos os cards
    async findAll(): Promise<Card[]> {
        return await Card.findAll();
    }

    // Buscar card por ID
    async findById(id: number): Promise<Card | null> {
        return await Card.findByPk(id);
    }

    // Buscar cards por disciplina
    async findByDisciplina(disciplina: string): Promise<Card[]> {
        return await Card.findAll({
            where: { disciplina }
        });
    }

    // Buscar cards por autor
    async findByAutor(autor_id: number): Promise<Card[]> {
        return await Card.findAll({
            where: { autor_id }
        });
    }

    // Criar novo card
    async create(cardData: CardCreationAttributes): Promise<Card> {
        return await Card.create(cardData);
    }

    // Atualizar card
    async update(id: number, cardData: Partial<CardAttributes>): Promise<Card | null> {
        const [updatedRowsCount] = await Card.update(cardData, {
            where: { id }
        });

        if (updatedRowsCount === 0) {
            return null;
        }

        return await this.findById(id);
    }

    // Deletar card
    async delete(id: number): Promise<boolean> {
        const deletedRowsCount = await Card.destroy({
            where: { id }
        });

        return deletedRowsCount > 0;
    }

    // Buscar cards que contenham uma tag específica
    async findByTag(tag: string): Promise<Card[]> {
        return await Card.findAll({
            where: {
                tags: {
                    [Symbol.for('$contains')]: [tag]
                }
            }
        });
    }
}