// netlify/functions/resetStreakAndDeleteImages.js

const { initializeApp, getApps, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

// Initialize Firebase Admin SDK
if (!getApps().length) {
  initializeApp({
    credential: cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY))
  });
}

const db = getFirestore();

exports.handler = async function(event, context) {
  // Fetch all group IDs or use a specific group ID
  const groupsRef = db.collection('groups');
  const groupsSnapshot = await groupsRef.get();

  const updatePromises = groupsSnapshot.docs.map(async (groupDoc) => {
    const groupId = groupDoc.id;
    const groupData = groupDoc.data();
    const today = new Date().toISOString().split('T')[0];
    const uploadedImages = groupData.uploadedImages || [];
    const userIds = groupData.userIds || [];
    const lastStreakUpdate = groupData.lastStreakUpdate;

    const hasAllUploaded = userIds.every((userId) =>
      uploadedImages.some(
        (img) => img.userId === userId && img.date === today
      )
    );

    let newStreak = groupData.streak || 0;
    if (hasAllUploaded) {
      if (lastStreakUpdate !== today) {
        newStreak += 1;
      }
    } else {
      newStreak = 0;
    }

    // Update the group data
    return groupDoc.ref.update({
      uploadedImages: [],
      streak: newStreak,
      lastStreakUpdate: today,
    });
  });

  try {
    await Promise.all(updatePromises);
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Streaks reset and images cleared successfully for all groups!" }),
    };
  } catch (error) {
    console.error("Error resetting streaks and clearing images:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to reset streaks and clear images" }),
    };
  }
}
