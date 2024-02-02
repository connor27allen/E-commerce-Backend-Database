const router = require('express').Router();
const { Category, Product } = require('../../models');


//GET Route to find all categories
router.get('/', async (req, res) => {
    try {
      const dbCatData = await Category.findAll({
        include: {
          model: Product,
          attributes: ['id', 'product_name', 'price', 'stock', 'category_id']
        }
      });
  
      if (!dbCatData) {
        res.status(404).json({ message: 'No categories found' });
        return;
      }
  
      res.json(dbCatData);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  });

  //GET Route to find one category by its ID
  router.get('/:id', async (req, res) => {
    try {
      const dbCatData = await Category.findOne({
        where: {
          id: req.params.id
        },
        include: {
          model: Product,
          attributes: ['id', 'product_name', 'price', 'stock', 'category_id']
        }
      });
  
      if (!dbCatData) {
        res.status(404).json({ message: 'No categories found' });
        return;
      }
  
      res.json(dbCatData);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  });

  //create a new category
  router.post('/', async (req, res) => {
    try {
      const dbCatData = await Category.create({
        category_name: req.body.category_name
      });
  
      res.json(dbCatData);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  });

  //update a category by its ID 
  router.put('/:id', async (req, res) => {
    try {
      const dbCatData = await Category.update(req.body, {
        where: {
          id: req.params.id
        }
      });
  
      if (dbCatData[0] === 0) {
        res.status(404).json({ message: 'No category found with this id' });
        return;
      }
  
      res.json(dbCatData);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  });

  //delete a category by its id value
  router.delete('/:id', async (req, res) => {
    try {
      const dbCatData = await Category.destroy({
        where: {
          id: req.params.id
        }
      });
  
      if (dbCatData === 0) {
        res.status(404).json({ message: 'No category found with that id.' });
        return;
      }
  
      res.json(dbCatData);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  });
  
  module.exports = router;