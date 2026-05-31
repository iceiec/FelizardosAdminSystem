const { validate } = require('uuid');
console.log('1111 valid?', validate('11111111-1111-1111-1111-111111111111'));
console.log('3333 valid?', validate('33333333-3333-3333-3333-333333333333'));
console.log('real v4 valid?', validate('550e8400-e29b-41d4-a716-446655440000'));
