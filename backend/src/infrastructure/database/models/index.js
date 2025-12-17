/**
 * Database Models Index
 * Central export point for all Mongoose models
 * Models will be added here as they are created
 */

// Import models
const User = require('./User');
const Transaction = require('./Transaction');
const Category = require('./Category');
// const Goal = require('./Goal');

// Export models object
const models = {
  User,
  Transaction,
  Category,
  // Goal
};

// Helper function to get model by name
const getModel = (modelName) => {
  const model = models[modelName];
  if (!model) {
    throw new Error(`Model '${modelName}' not found`);
  }
  return model;
};

// Helper function to check if model exists
const hasModel = (modelName) => {
  return modelName in models;
};

// Get all model names
const getModelNames = () => {
  return Object.keys(models);
};

module.exports = {
  ...models,
  getModel,
  hasModel,
  getModelNames
};