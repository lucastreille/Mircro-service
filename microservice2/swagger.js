/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - name
 *         - description
 *         - price
 *         - category
 *         - stock
 *       properties:
 *         name:
 *           type: string
 *           description: Le nom du produit
 *         description:
 *           type: string
 *           description: Une description du produit
 *         price:
 *           type: number
 *           description: Le prix du produit
 *         category:
 *           type: string
 *           enum: [Keyboard, Mouse, Monitor, Other]
 *           description: La catégorie du produit
 *         stock:
 *           type: number
 *           description: Le stock disponible pour le produit
 *         reduction:
 *           type: number
 *           description: Pourcentage de réduction pour le produit (optionnel)
 *           default: null
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Date et heure de création du produit
 */

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Crée un nouveau produit Endpoint = /products Token requis = Oui
 *     tags: [Produits]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       201:
 *         description: Produit créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 */

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Récupère la liste de tous les produits Endpoint = /products Token requis = Non
 *     tags: [Produits]
 *     responses:
 *       200:
 *         description: Liste des produits
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Récupère un produit par son ID Endpoint = /products/:id Token requis = Non
 *     tags: [Produits]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID du produit
 *     responses:
 *       200:
 *         description: Produit trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Produit non trouvé
 */

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Met à jour un produit existant Endpoint = /products/:id Token requis = Oui
 *     tags: [Produits]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID du produit
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: Produit mis à jour avec succès
 */

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Supprime un produit Endpoint = /products/:id Token requis = Oui
 *     tags: [Produits]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID du produit
 *     responses:
 *       200:
 *         description: Produit supprimé avec succès
 *       404:
 *         description: Produit non trouvé
 */
