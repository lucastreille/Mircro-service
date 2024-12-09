const axios = require('axios');

async function checkAdmin(req, res, next) {
    try {
        // Requête vers le microservice utilisateur pour récupérer les détails de l'utilisateur
        const response = await axios.get(`http://user-service:3001/user`, {
            headers: {
                Authorization: `Bearer ${req.header('Authorization')?.replace('Bearer ', '')}`,
            },
        });

        const user = response.data.user;
        console.log('Détails utilisateur:', user);

        if (!user || user.is_admin !== 1) {
            return res.status(403).json({ message: 'Accès refusé. Rôle administrateur requis.' });
        }

        next();
    } catch (error) {
        console.error('Erreur lors de la vérification de l\'administrateur:', error);
        return res.status(500).json({ message: 'Erreur serveur lors de la vérification des privilèges.' });
    }
}

module.exports = checkAdmin;
