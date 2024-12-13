/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - uuid
 *         - name
 *         - firstname
 *         - email
 *         - password
 *         - is_admin
 *       properties:
 *         uuid:
 *           type: string
 *           description: L'identifiant unique de l'utilisateur
 *         name:
 *           type: string
 *           description: Le nom de l'utilisateur
 *         firstname:
 *           type: string
 *           description: Le prénom de l'utilisateur
 *         email:
 *           type: string
 *           format: email
 *           description: L'adresse email de l'utilisateur
 *         password:
 *           type: string
 *           description: Le mot de passe de l'utilisateur
 *         is_admin:
 *           type: integer
 *           description: Statut d'administration de l'utilisateur (0 = utilisateur, 1 = administrateur)
 *           default: 0
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Login:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: Adresse email de l'utilisateur
 *           example: "user@example.com"
 *         password:
 *           type: string
 *           description: Mot de passe de l'utilisateur
 *           example: "securepassword123"
 */

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Crée un nouvel utilisateur Endpoint = /register Token requis = Non
 *     tags: [Utilisateurs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: Utilisateur créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Connecte un utilisateur avec son email et son mot de passe Endpoint = /login Token requis = Non
 *     tags: [Utilisateurs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Login'
 *     responses:
 *       200:
 *         description: Connexion réussie, retourne un token d'authentification
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description : Message de confirmation
 *                   example : "Connexion réussie"
 *                 token:
 *                   type: string
 *                   description: Token JWT pour authentification
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         description: Requête invalide, email ou mot de passe manquant
 *       401:
 *         description: Échec de l'authentification, email ou mot de passe incorrect
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Récupère la liste de tous les utilisateurs Endpoint = /Users Token requis = Non
 *     tags: [Utilisateurs]
 *     responses:
 *       200:
 *         description: Liste des utilisateurs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */

/**
 * @swagger
 * /users/{uuid}:
 *   get:
 *     summary: Récupère un utilisateur par son UUID Endpoint = /Users/:uuid Token requis = Oui
 *     tags: [Utilisateurs]
 *     parameters:
 *       - in: path
 *         name: uuid
 *         schema:
 *           type: string
 *         required: true
 *         description: UUID de l'utilisateur
 *     responses:
 *       200:
 *         description: Utilisateur trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: Utilisateur non trouvé
 */

/**
 * @swagger
 * /users/{uuid}:
 *   put:
 *     summary: Met à jour les informations d'un utilisateur Endpoint = /Users/:uuid Token requis = Oui
 *     tags: [Utilisateurs]
 *     parameters:
 *       - in: path
 *         name: uuid
 *         schema:
 *           type: string
 *         required: true
 *         description: UUID de l'utilisateur
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: Utilisateur mis à jour avec succès
 */

/**
 * @swagger
 * /users/{uuid}:
 *   delete:
 *     summary: Supprime un utilisateur Endpoint = /Users/:uuid Token requis = Oui
 *     tags: [Utilisateurs]
 *     parameters:
 *       - in: path
 *         name: uuid
 *         schema:
 *           type: string
 *         required: true
 *         description: UUID de l'utilisateur
 *     responses:
 *       200:
 *         description: Utilisateur supprimé avec succès
 *       404:
 *         description: Utilisateur non trouvé
 */
