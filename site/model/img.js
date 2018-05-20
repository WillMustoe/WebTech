"use strict"

const Sequelize = require('sequelize');
const sequelize = new Sequelize('noiser', 'admin', 'StableOneTwoFour', {
    host: 'localhost',
    dialect: 'sqlite',
    operatorsAliases: false,

    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    storage: 'data.sqlite'
});

var Img = sequelize.define('imgs', {
    img_id: {
        type : Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id:{
        type: Sequelize.INTEGER,
        unique: false,
        allowNull: false
    },
    name: {
        type: Sequelize.STRING,
        unique: false,
        allowNull: false
    },
    filename: {
        type: Sequelize.STRING,
        unique: false,
        allowNull: false
    },
    score: {
        type: Sequelize.INTEGER,
        unique: false,
        allowNull: false
    }
});




// create all the defined tables in the specified database.
sequelize.sync()
    .then(() => console.log('Image Table Created/Opened Successfully'))
    .catch(error => console.log('Error in Creating/Opening: ', error));


module.exports = Img;