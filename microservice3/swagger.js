/**
 * @swagger
 * components:
 *   schemas:
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
 *         value:
 *           type: number
 *           description: Valeur de la réduction en pourcentage
 *         expiryDate:
 *           type: string
 *           format: date-time
 *           description: Date d'expiration de la réduction
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
 * /discounts:
 *   get:
 *     summary: Récupère la liste de tous les codes de réduction
 *     tags: [Réductions]
 *     responses:
 *       200:
 *         description: Liste des codes de réduction
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Discount'
 */

/**
 * @swagger
 * /discounts/{code}:
 *   get:
 *     summary: Récupère un code de réduction par son code
 *     tags: [Réductions]
 *     parameters:
 *       - in: path
 *         name: code
 *         schema:
 *           type: string
 *         required: true
 *         description: Code unique de la réduction
 *     responses:
 *       200:
 *         description: Code de réduction trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Discount'
 *       404:
 *         description: Code de réduction non trouvé
 */

/**
 * @swagger
 * /discounts/{code}:
 *   delete:
 *     summary: Supprime un code de réduction
 *     tags: [Réductions]
 *     parameters:
 *       - in: path
 *         name: code
 *         schema:
 *           type: string
 *         required: true
 *         description: Code unique de la réduction
 *     responses:
 *       200:
 *         description: Code de réduction supprimé avec succès
 *       404:
 *         description: Code de réduction non trouvé
 */


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
 *         quantity:
 *           type: number
 *           description: Quantité commandée
 *         price:
 *           type: number
 *           description: Prix unitaire du produit
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
 *         products:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ProductInOrder'
 *           description: Liste des produits dans la commande
 *         totalPrice:
 *           type: number
 *           description: Prix total de la commande
 *         status:
 *           type: string
 *           description: Statut de la commande (ex: 'pending', 'completed', 'canceled')
 *           default: 'pending'
 *         discountCode:
 *           type: string
 *           description: Code de réduction appliqué (si applicable)
 *           default: null
 *         discountValue:
 *           type: number
 *           description: Valeur de la réduction appliquée
 *           default: 0
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Date de création de la commande
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
 *   get:
 *     summary: Récupère une commande par son ID
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
 *         description: Commande trouvée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       404:
 *         description: Commande non trouvée
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
