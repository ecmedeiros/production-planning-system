
const Talao_pedido = require('../../src/database/models/talao_pedido.js')


export default async function saveEndTime (req,res) {
    try {
        
        const newOrder = req.body.orders
        const machineId = req.body.machineId

        for (let order in newOrder) {
            const newTime = await Talao_pedido.findByPk(newOrder[order].id);
            newTime.horario_fim = await newOrder[order].horario_fim
            newTime.horario_inicio = await newOrder[order].horario_inicio
            newTime.id_maquina = await newOrder[order].id_maquina
            newTime.status = await newOrder[order].status
            
            
            await newTime.save()
        }
        
        res.status(200).json('Ordens gravadas no banco com sucesso!')

    } catch (error) {
    console.error('Error fetching data:', error)        
    res.status(500).json({error: 'Internal Server Error'})
    }
};

