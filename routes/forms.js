var express = require('express');
var router = express.Router();
var db = require('../database/database');
//var Comment = require('../models/Comment')(db.sequelize)
/* GET users listing. */
router.get('/', async function(req, res, next) {
  try {
    const { Comment } = await db();
    //const comments = await Comment.findAll();

    // Now you can use sequelize and Comment model
    const comments = await Comment.findAll();
    console.log("€€€€€€€€€€€€€");
    console.log(comments);
    //res.json(comments)
    // Now 'comments' contains the fetched data
    // You can use it in your response or render the view

    // Example: Render a view with the comments
    res.render('form.twig', { title: 'My form', comments: comments });
  } catch (e) {
    console.log(e);
    // Handle errors appropriately, send an error response, etc.
    res.status(500).send('Internal Server Error');
  }
});

router.post('/create',async function(req, res, next) {
  //console.log(req.body);
  //res.redirect('/forms');
  const { Comment } = await db();
  const { title } = req.body;
  await Comment.create({title});
  res.redirect('/forms');
});


router.get('/update/:id', async (req, res) => {
  try {
    const { Comment } = await db();

    // Assuming you send the updated comment data in the request body
    const { title } = req.body;
    const { id } = req.params;

    // Find the comment by ID
    const commentToUpdate = await Comment.findByPk(id);

    // Check if the comment exists
    if (!commentToUpdate) {
      return res.status(404).json({ error: 'Comment not found' });
    }
    res.render('formupdate.twig', { title: 'Update form', comment: commentToUpdate });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/update/:id', async (req, res) => {
  try {
    const { Comment } = await db();

    // Assuming you send the updated comment data in the request body
    const { title } = req.body;
    const { id } = req.params;

    // Find the comment by ID
    const commentToUpdate = await Comment.findByPk(id);

    // Check if the comment exists
    if (!commentToUpdate) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    // Update the comment
    commentToUpdate.title = title;
    await commentToUpdate.save();

    // Send the updated comment as a response
    // res.json(commentToUpdate);
    res.redirect('/forms');
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/delete/:id', async (req, res) => {
  try {
    const { Comment } = await db();

    const { id } = req.params;

    // Find the comment by ID
    const commentToDelete = await Comment.findByPk(id);

    // Check if the comment exists
    if (!commentToDelete) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    // Delete the comment
    await commentToDelete.destroy();

    // Send a success message as a response
    //res.json({ message: 'Comment deleted successfully' });
    res.redirect('/forms');
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
