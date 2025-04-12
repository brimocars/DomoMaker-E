const models = require('../models');

const { Domo } = models;

const makerPage = async (req, res) => res.render('app');

const makeDomo = async (req, res) => {
  const { name, age, level } = req.body;

  if (!name || !age || !level) {
    return res.status(400).json({ error: 'Both name and age are required!' });
  }

  const domoData = {
    name,
    age,
    level,
    owner: req.session.account._id,
  };

  try {
    const newDomo = new Domo(domoData);
    await newDomo.save();
    return res.status(201).json({ name: newDomo.name, age: newDomo.age, level: newDomo.level });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Domo already exists!' });
    }
    return res.status(500).json({ error: 'An error occurred making domo!' });
  }
};

const getDomos = async (req, res) => {
  try {
    const domos = await Domo.find({ owner: req.session.account._id }).select('name age level').lean().exec();
    return res.json({ domos });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error retrieving domos!' });
  }
};

const deleteDomo = async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Both name and age are required!' });
  }

  const domoData = {
    name,
    owner: req.session.account._id,
  };

  try {
    await Domo.deleteOne(domoData);
    return res.status(200).json({ message: 'Domo deleted successfully!' });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'An error occurred deleting domo!' });
  }
};

module.exports = {
  makerPage,
  makeDomo,
  deleteDomo,
  getDomos,
};
