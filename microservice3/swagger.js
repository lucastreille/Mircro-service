/**
 * @swagger
 * components:
 *   schemas:
 *     ProductInOrder:
 *       type: object
 *       required:
 *         - productId
 *         - quantity
 *         - price
 *       properties:
 *         productId:
 *           type: string
 *           description: ID unique du produit
 *           example: "prod123"
 *         quantity:
 *           type: number
 *           description: Quantité commandée
 *           example: 2
 *         price:
 *           type: number
 *           description: Prix unitaire du produit
 *           example: 49.99
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
 *         products:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ProductInOrder'
 *           description: Liste des produits dans la commande
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
 */


/**
 * @swagger
 * /discounts:
 *   post:
 *     summary: Crée un nouveau code de réduction
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
 * /orders:
 *   post:
 *     summary: Crée une nouvelle commande
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
 *     summary: Récupère la liste de toutes les commandes
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
 *     summary: Met à jour une commande existante
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
 *     summary: Supprime une commande
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
