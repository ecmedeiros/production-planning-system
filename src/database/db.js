// import {Sequelize} from 'sequelize'
const Sequelize = require('sequelize')
require('dotenv').config();

const user = process.env.USER
const wes_database = process.env.WES_DATABASE
const eligo_database = process.env.ELIGO_DATABASE
const password = process.env.PASSWORD
const dialect = process.env.DIALECT
const host = process.env.HOST
const port = process.env.PORTT
const timezone = process.env.TIMEZONE

const wes = new Sequelize(wes_database, user, password, {
    dialect: dialect,
    host: host,
    port: port,
    timezone: timezone, // Defina o fuso horário correto aqui
    logging: false,
    define: {
        defaultScope: {
            attributes: { exclude: ['createdAt', 'updatedAt'] }
        }
    }
})

const eligo = new Sequelize(eligo_database, user, password, {
    dialect: dialect,
    host: host,
    port: port,
    logging: false,
    timezone: timezone // Defina o fuso horário correto aqui
})

module.exports = { eligo, wes }