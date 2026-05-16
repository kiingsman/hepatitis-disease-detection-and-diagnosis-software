const repository = require('../data/repository');

async function getDashboard(req, res, next) {
  try {
    res.json(await repository.getDashboard());
  } catch (error) {
    next(error);
  }
}

module.exports = { getDashboard };
