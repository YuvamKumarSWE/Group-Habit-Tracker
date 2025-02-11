/* eslint-disable no-undef */
/*
const { onSchedule } = require('firebase-functions/v2/scheduler');
const admin = require('firebase-admin');

admin.initializeApp();

exports.checkUploadsAtMidnight = onSchedule(
  {
    schedule: '0 0 * * *',
    timeZone: 'UTC',
    retryConfig: {
      retryCount: 3,
      maxRetrySeconds: 60
    }
  },
  async (event) => {
    try {
      const db = admin.firestore();
      const groupsSnapshot = await db.collection('groups').get();

      for (const groupDoc of groupsSnapshot.docs) {
        const groupData = groupDoc.data();
        const members = groupData.members || [];
        const uploads = groupData.uploads || {};

        const allUploaded = members.every(memberId => uploads[memberId]);

        await groupDoc.ref.update({
          uploads: {},
          streak: allUploaded
            ? admin.firestore.FieldValue.increment(1)
            : 0
        });
      }

      console.log('Daily upload check completed successfully');
    } catch (error) {
      console.error('Error in checkUploadsAtMidnight:', error);
    }
  }
);
*/
const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

// Function to check user uploads at midnight and update streaks
exports.checkUploadsAtMidnight = functions.pubsub
  .schedule("0 0 * * *")
  .timeZone("UTC")
  .onRun(async () => {
    try {
      const db = admin.firestore();

      // Get all groups
      const groupsSnapshot = await db.collection("groups").get();

      for (const groupDoc of groupsSnapshot.docs) {
        const groupData = groupDoc.data();
        const members = groupData.members || [];
        const uploads = groupData.uploads || {};

        // Check if all members have uploaded
        const allUploaded = members.every((memberId) => uploads[memberId]);

        // Update group streak based on upload status
        await groupDoc.ref.update({
          uploads: {},
          streak: allUploaded
            ? admin.firestore.FieldValue.increment(0) // Increment streak if all uploaded
            : 0, // Reset streak if someone missed
        });
      }

      console.log("Daily upload check completed successfully.");
      return null;
    } catch (error) {
      console.error("Error in checkUploadsAtMidnight:", error);
      return null;
    }
  });