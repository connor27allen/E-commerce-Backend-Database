const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

//GET all tags
router.get('/', async (req, res) => {
    try {
      const dbTagData = await Tag.findAll({
        include: {
          model: Product,
          attributes: ['product_name', 'price', 'stock', 'category_id']
        }
      });
  
      res.json(dbTagData);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  });

  //GET a single tag by its ID
  router.get('/:id', async (req, res) => {
    try {
      const dbTagData = await Tag.findOne({
        where: {
          id: req.params.id
        },
        include: {
          model: Product,
          attributes: ['product_name', 'price', 'stock', 'category_id']
        }
      });
  
      res.json(dbTagData);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  });

  //Create a new tag
  router.post('/', async (req, res) => {
    try {
      const dbTagData = await Tag.create({
        tag_name: req.body.tag_name
      });
  
      res.json(dbTagData);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  });

  //update a tag's name by ID value
  router.put('/:id', async (req, res) => {
    try {
      const dbTagData = await Tag.update(req.body, {
        where: {
          id: req.params.id
        }
      });
  
      if (dbTagData[0] === 0) {
        res.status(404).json({ message: 'No tag found with this id' });
        return;
      }
  
      res.json(dbTagData);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  });

  //Delete a tag by its ID value

  router.delete('/:id', async (req, res) => {
    try {
      const dbTagData = await Tag.destroy({
        where: {
          id: req.params.id
        }
      });
  
      if (dbTagData === 0) {
        res.status(404).json({ message: 'No tag found with this id' });
        return;
      }
  
      res.json(dbTagData);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  });

  module.exports = router;