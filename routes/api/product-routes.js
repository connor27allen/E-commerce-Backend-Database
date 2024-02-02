const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');


//GET all products
router.get('/', async (req, res) => {
    try {
      const dbProductData = await Product.findAll({
        attributes: ['id', 'product_name', 'price', 'stock'],
        include: [
          {
            model: Category,
            attributes: ['category_name']
          },
          {
            model: Tag,
            attributes: ['tag_name']
          }
        ]
      });
  
      res.json(dbProductData);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  });

  //GET a single product by its ID
  router.get('/:id', async (req, res) => {
    try {
      const dbProductData = await Product.findOne({
        where: {
          id: req.params.id
        },
        attributes: ['id', 'product_name', 'price', 'stock'],
        include: [
          {
            model: Category,
            attributes: ['category_name']
          },
          {
            model: Tag,
            attributes: ['tag_name']
          }
        ]
      });
  
      if (!dbProductData) {
        res.status(404).json({ message: 'No product found with this id' });
        return;
      }
  
      res.json(dbProductData);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  });

  //Create a new product
  router.post('/', async (req, res) => {
    try {
      const product = await Product.create({
        product_name: req.body.product_name,
        price: req.body.price,
        stock: req.body.stock,
        category_id: req.body.category_id,
        tagIds: req.body.tagIds
      });
  
      if (req.body.tagIds.length) {
        const productTagIdArr = req.body.tagIds.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id,
          };
        });
  
        await ProductTag.bulkCreate(productTagIdArr);
      }
  
      res.status(200).json(product);
    } catch (err) {
      console.log(err);
      res.status(400).json(err);
    }
  });

  //update product
  router.put('/:id', async (req, res) => {
    try {
      await Product.update(req.body, {
        where: {
          id: req.params.id,
        },
      });
  
      const productTags = await ProductTag.findAll({ where: { product_id: req.params.id } });
  
      const productTagIds = productTags.map(({ tag_id }) => tag_id);
  
      const newProductTags = req.body.tagIds
        .filter((tag_id) => !productTagIds.includes(tag_id))
        .map((tag_id) => {
          return {
            product_id: req.params.id,
            tag_id,
          };
        });
  
      const productTagsToRemove = productTags
        .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
        .map(({ id }) => id);
  
      await Promise.all([
        ProductTag.destroy({ where: { id: productTagsToRemove } }),
        ProductTag.bulkCreate(newProductTags),
      ]);
  
      res.json(productTagsToRemove);
    } catch (err) {
      console.log(err);
      res.status(400).json(err);
    }
  });

  //delete a product by its ID
  router.delete('/:id', async (req, res) => {
    try {
      const dbProductData = await Product.destroy({
        where: {
          id: req.params.id
        }
      });
  
      if (dbProductData === 0) {
        res.status(404).json({ message: 'No product found with this id' });
        return;
      }
  
      res.json(dbProductData);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  });
  
  module.exports = router;