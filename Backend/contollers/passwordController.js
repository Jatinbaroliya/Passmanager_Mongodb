const Password = require('../models/Password');

const getPasswords = async (req, res) => {
  try {
    const passwords = await Password.find();
    res.json(passwords);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createPassword = async (req, res) => {
  const password = new Password(req.body);

  try {
    const savedPassword = await password.save();
    res.status(201).json(savedPassword);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { getPasswords, createPassword };
