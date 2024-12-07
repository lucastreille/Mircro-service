function checkAdmin(req, res, next) {
    if (req.user.is_admin !== '1') {
        return res.status(403).json({ message: 'Accès refusé. Rôle administrateur requis.' });
    }
    next();
}

module.exports = checkAdmin;