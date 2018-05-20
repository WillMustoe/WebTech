"use strict"
const bcrypt = require('bcrypt');

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

var User = sequelize.define('users', {
    user_id: {
        type : Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    forename: {
        type: Sequelize.STRING,
        unique: false,
        allowNull: false
    },
    lastname: {
        type: Sequelize.STRING,
        unique: false,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    }
}, {
    hooks: {
        beforeCreate: (user) => {
            const salt = bcrypt.genSaltSync();
            user.password = bcrypt.hashSync(user.password, salt);
        },
        beforeUpdate: (user) => {
            const salt = bcrypt.genSaltSync();
            user.password = bcrypt.hashSync(user.password, salt);
        }
    }
});

User.prototype.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

// create all the defined tables in the specified database.
sequelize.sync()
    .then(() => console.log('Table Created/Opened Successfully'))
    .catch(error => console.log('Error in Creating/Opening: ', error));


module.exports = User;