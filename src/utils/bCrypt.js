const bCrypt = require('bcrypt');

const isValidPassword = (user, password) => {
    return bCrypt.compareSync(password, user.password);
};

const createHash = (password) => {
    return bCrypt.hashSync(
        password,
        bCrypt.genSaltSync(10),
        null
    );
}

module.exports = {
    isValidPassword,
    createHash
};