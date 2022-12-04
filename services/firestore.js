const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');
// Initialize firebase connection
const serviceAccount = require('./firebase-key.json');



const app = initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore(app);

module.exports = { db }