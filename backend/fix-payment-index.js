const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI;

async function fixPaymentIndex() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected successfully');

    const db = mongoose.connection.db;
    const collection = db.collection('payments');

    console.log('Dropping old stripePaymentIntentId index...');
    try {
      await collection.dropIndex('stripePaymentIntentId_1');
      console.log('✅ Old index dropped successfully');
    } catch (error) {
      if (error.code === 27) {
        console.log('Index does not exist, skipping drop');
      } else {
        throw error;
      }
    }

    console.log('Creating new sparse index on stripePaymentIntentId...');
    await collection.createIndex(
      { stripePaymentIntentId: 1 },
      { sparse: true, unique: false }
    );
    console.log('✅ New sparse index created successfully');

    console.log('\n✅ Payment index fixed! Users can now purchase multiple services.');
    
    await mongoose.connection.close();
    console.log('Connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error fixing payment index:', error);
    process.exit(1);
  }
}

fixPaymentIndex();
