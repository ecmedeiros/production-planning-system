import Talao_pedido from '../../src/database/models/talao_pedido';
import Sequelize from 'sequelize';

export default async function getOrders(req, res) {

    try {

        const machineId = req.body.machineId

        const horario_inicio_query = await Talao_pedido.findOne({
            attributes: [
                [Sequelize.fn('MIN', Sequelize.col('horario_inicio')), 'horario_inicio']
            ],
            where: {
                id_maquina: machineId
            },
            raw: true
        });

        const horario_fim_query = await Talao_pedido.findOne({
            attributes: [
                [Sequelize.fn('MAX', Sequelize.col('horario_fim')), 'horario_fim']
            ],
            where: {
                id_maquina: machineId
            },
            raw: true
        });

        res.status(200).json({ "horario_inicio": horario_inicio_query.horario_inicio, "horario_fim": horario_fim_query.horario_fim });

    } catch (err) {
        console.error("Error connecting or querying PostgreSQL:", err);
    }
}
