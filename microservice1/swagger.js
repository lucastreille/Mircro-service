/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - uuid
 *         - nom
 *         - prenom
 *         - email
 *         - mot_de_passe
 *         - is_admin
 *       properties:
 *         uuid:
 *           type: string
 *           description: L'identifiant unique de l'utilisateur
 *         nom:
 *           type: string
 *           description: Le nom de l'utilisateur
 *         prenom:
 *           type: string
 *           description: Le prénom de l'utilisateur
 *         email:
 *           type: string
 *           format: email
 *           description: L'adresse email de l'utilisateur
 *         mot_de_passe:
 *           type: string
 *           description: Le mot de passe de l'utilisateur
 *         is_admin:
 *           type: integer
 *           description: Statut d'administration de l'utilisateur (0 = utilisateur, 1 = administrateur)
 *           default: 0
 */

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Crée un nouvel utilisateur Endpoint : /register Token requis : Non
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
