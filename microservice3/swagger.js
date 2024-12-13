/**
 * @swagger
 * components:
 *   schemas:
 *     Order:
 *       type: object
 *       required:
 *         - userId
 *         - products
 *         - totalPrice
 *       properties:
 *         userId:
 *           type: string
 *           description: ID de l'utilisateur ayant passé la commande
 *           example: "user123"
 *         totalPrice:
 *           type: number
 *           description: Prix total de la commande
 *           example: 99.99
 *         status:
 *           type: string
 *           description: Statut de la commande
 *           default: pending
 *           example: "completed"
 *         discountCode:
 *           type: string
 *           description: Code de réduction appliqué
 *           default: null
 *           example: "SAVE10"
 *         discountValue:
 *           type: number
 *           description: Valeur de la réduction appliquée
 *           default: 0
 *           example: 10
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Date de création de la commande
 *           example: "2023-12-01T12:34:56Z"
 *     Discount:
 *       type: object
 *       required:
 *         - code
 *         - value
 *         - expiryDate
 *       properties:
 *         code:
 *           type: string
 *           description: Code unique de la réduction
 *           example: "PROMO2024"
 *         value:
 *           type: number
 *           description: Valeur de la réduction en pourcentage
 *           example: 15
 *         expiryDate:
 *           type: string
 *           format: date-time
 *           description: Date d'expiration du code de réduction
 *           example: "2024-12-31T23:59:59Z"
 */


/**
 * @swagger
 * /discounts:
 *   post:
 *     summary: Crée un nouveau code de réduction Endpoint = /discounts Token requis = Oui
 *     tags: [Réductions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Discount'
 *     responses:
 *       201:
 *         description: Code de réduction créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Discount'
 */

/**
 * @swagger
 * /orders/{id}:
 *   patch:
 *     summary: Applique un code promo à une commande Endpoint = /orders/:id Token requis = Oui
 *     tags: [Commandes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la commande à laquelle appliquer le code promo
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - discountCode
 *             properties:
 *               discountCode:
 *                 type: string
 *                 description: Code promo à appliquer
 *                 example: "PROMO2024"
 *     responses:
 *       200:
 *         description: Code promo appliqué avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       404:
 *         description: Commande ou code promo non trouvé
 *       400:
 *         description: Code promo invalide ou expiré
 */


/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Crée une nouvelle commande Endpoint = /orders Token requis = Oui
 *     tags: [Commandes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Order'
 *     responses:
 *       201:
 *         description: Commande créée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 */

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Récupère la liste de toutes les commandes Endpoint = /orders/:id Token requis = Oui
 *     tags: [Commandes]
 *     responses:
 *       200:
 *         description: Liste des commandes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 */

/**
 * @swagger
 * /orders/{id}:
 *   put:
 *     summary: Met à jour une commande existante Endpoint = /orders/:id Token requis = Oui
 *     tags: [Commandes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la commande
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Order'
 *     responses:
 *       200:
 *         description: Commande mise à jour avec succès
 */

/**
 * @swagger
 * /orders/{id}:
 *   delete:
 *     summary: Supprime une commande Endpoint = /orders/:id Token requis = Oui
 *     tags: [Commandes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la commande
 *     responses:
 *       200:
 *         description: Commande supprimée avec succès
 *       404:
 *         description: Commande non trouvée
 */
