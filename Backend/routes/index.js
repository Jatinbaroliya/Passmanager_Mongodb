const express = require('express');
const Password = require('../models/Password');
const router = express.Router();

// Get all passwords
router.get('/', async (req, res) => {
  try {
    const passwords = await Password.find();
    res.json(passwords);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Save a new password
router.post('/', async (req, res) => {
  const { site, username, password } = req.body;
   console.log(site);
  if (!site || !username || !password) {
    return res.status(400).json({ message: 'Please fill all fields' });
  }

  const newPassword = new Password({
    site,
    username,
    password,
  });

  try {
    const savedPassword = await newPassword.save();
    res.status(201).json(savedPassword);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.put('/:id', async (req, res) => {
  const { site, username, password } = req.body;

  try {
    const updatedPassword = await Password.findByIdAndUpdate(
      req.params.id,
      { site, username, password },
      { new: true }
    );

    if (!updatedPassword) {
      return res.status(404).json({ message: 'Password not found' });
    }

    res.json(updatedPassword);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete a password
router.delete('/:id', async (req, res) => {
  try {
    const deletedPassword = await Password.findByIdAndDelete(req.params.id);

    if (!deletedPassword) {
      return res.status(404).json({ message: 'Password not found' });
    }

    res.json({ message: 'Password deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
