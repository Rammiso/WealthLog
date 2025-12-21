// Simple test to identify the issue
console.log('Testing server components...');

try {
  console.log('1. Testing config...');
  const config = require('./src/config/env');
  console.log('✓ Config loaded');

  console.log('2. Testing database models...');
  const models = require('./src/infrastructure/database/models');
  console.log('✓ Models loaded');

  console.log('3. Testing repositories...');
  const { getGoalRepository } = require('./src/infrastructure/repositories/RepositoryFactory');
  console.log('✓ Repository factory loaded');

  console.log('4. Testing validators...');
  const validators = require('./src/app/validators');
  console.log('✓ Validators loaded');

  console.log('5. Testing goal controller...');
  const goalController = require('./src/app/controllers/goalController');
  console.log('✓ Goal controller loaded');

  console.log('6. Testing goal routes...');
  const goalRoutes = require('./src/app/routes/goalRoutes');
  console.log('✓ Goal routes loaded');

  console.log('All components loaded successfully!');
} catch (error) {
  console.error('Error loading component:', error.message);
  console.error('Stack:', error.stack);
}