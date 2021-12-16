const admin = true;

const isAdmin = (req, res, next) => {
    if (admin) {
        next()
    } else {
        res
            .status(401)
            .json({
                error: -1,
                descripcion: `Ruta ${req.path}, método: ${req.method} no autorizada.`
            });
    };

};

module.exports = {
    isAdmin
};