const insertTable = require('../../src/database/insertTable')
const Talao_pedido = require('../../src/database/models/talao_pedido')

export default async function getOrders(req, res) {

    try {

        insertTable()

        const response = await Talao_pedido.findAll(
            {
                order:[['horario_inicio', 'ASC']],
                raw: true
            }
        )

        // const { method } = req
        // console.log("method:", method)
        res.status(200).json(response)

    } catch (err) {
        console.error("Error connecting or querying PostgreSQL:", err);
    } 
}



