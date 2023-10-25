

const Sequelize = require('sequelize')
const {wes} = require('../db')

const Maquinas = wes.define('maquinas', {
    id: {
        type: Sequelize.INTEGER,
        autoIncriment: true,
        allowNull: false,
        primaryKey: true
    },
    desc_maquina: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    cod_maquina: {
        type: Sequelize.STRING,
        allowNull: false
    },
    id_grupo: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
})

Maquinas.sync()
.then(() => {
  console.log('Maquinas model synced with database')
})
.catch(err => {
  console.error('Error syncing Maquinas model:', err)
})

module.exports = Maquinas