

const Sequelize = require('sequelize')
const { wes } = require('../db')

const Grupo_maquinas = wes.define('grupo_maquinas', {
    id: {
        type: Sequelize.INTEGER,
        autoIncriment: true,
        allowNull: false,
        primaryKey: true
    },
    desc_grupo: {
        type: Sequelize.STRING,
        allowNull: false,
    },
})

Grupo_maquinas.sync()
    .then(() => {
        console.log('Maquinas model synced with database')
    })
    .catch(err => {
        console.error('Error syncing Maquinas model:', err)
    })

module.exports = Grupo_maquinas