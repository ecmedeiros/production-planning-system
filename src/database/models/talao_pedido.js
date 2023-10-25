// import Sequelize from 'sequelize'
// import sequelize from './db'

const Sequelize = require('sequelize')
const {wes} = require('../db')



const Talao_pedido = wes.define('talao_pedido', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    talao : {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true

    },
    minutos : {
        type: Sequelize.DECIMAL,
        allowNull: false
    },
    hora_ajustada : {
        type: Sequelize.STRING,
        allowNull: false
    },
    cliente : {
        type: Sequelize.STRING,
        allowNull: false
    },
    pedido_venda : {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    quantidade_pares : {
        type: Sequelize.DECIMAL,
        allowNull: false
    },
    modelo : {
        type: Sequelize.STRING,
        allowNull: false
    },
    horario_fim: {
        type: Sequelize.DATE
    },
    horario_inicio: {
        type: Sequelize.DATE
    },
    id_maquina : {
        type: Sequelize.INTEGER,
    },
    status : {
        type: Sequelize.STRING
    }
})


Talao_pedido.sync() // Synchronize the Talao_pedido model with the database
  .then(() => {
    console.log('Talao_pedido model synced with the database');
  })
  .catch(err => {
    console.error('Error syncing Talao_pedido model:', err);
  });

module.exports = Talao_pedido