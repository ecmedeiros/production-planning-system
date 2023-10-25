// import { Client } from 'pg';
const Maquinas = require('../../src/database/models/maquinas.js')
const Grupo_maquinas = require('../../src/database/models/grupo_maquinas.js')
require('dotenv').config();

export default async function getOrders(req, res) {

  try {

    const groupMachines = await Grupo_maquinas.findAll({
      order: [['id', 'ASC']],
      raw: true
    })

    const machines = await Maquinas.findAll({
      order: [['id', 'ASC']],
      raw: true
    })

    const response = {
      groups: groupMachines,
      machines: machines
    };

    res.status(200).json([response]);
    
  } catch (err) {
    console.error("Error connecting or querying PostgreSQL:", err);
  }
}
