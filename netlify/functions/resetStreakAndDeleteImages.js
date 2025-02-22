const { initializeApp, getApps, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

// Initialize Firebase Admin SDK
if (!getApps().length) {
  try {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
    initializeApp({
      credential: cert(serviceAccount)
    });
  } catch (error) {
    console.error('Firebase initialization failed:', error);
    throw new Error('Failed to parse Firebase service account key. Please ensure it is a valid JSON string.');
  }
}

const db = getFirestore();

exports.handler = async (event, context) => {
  console.log('Starting reset streak and delete images function');

  try {
    const groupsRef = db.collection('groups');
    const groupsSnapshot = await groupsRef.get();

    if (groupsSnapshot.empty) {
      console.log('No groups found');
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'No groups to process' })
      };
    }

    const updatePromises = groupsSnapshot.docs.map(async (groupDoc) => {
      try {
        const groupId = groupDoc.id;
        const groupData = groupDoc.data();
        const today = new Date().toISOString().split('T')[0];
        const uploadedImages = groupData.uploadedImages || [];
        const userIds = groupData.userIds || [];
        const lastStreakUpdate = groupData.lastStreakUpdate || null;

        console.log(`Processing group ${groupId}: ${userIds.length} users, ${uploadedImages.length} images`);

        // Check if all users uploaded today
        const allUsersUploaded = userIds.every(userId =>
          uploadedImages.some(img => img.userId === userId && img.date === today)
        );

        let newStreak = groupData.streak || 0;

        // Always reset the images
        let updateData = {
          uploadedImages: [],
          lastStreakUpdate: today
        };

        // If last streak update was today, we don't update again
        if (lastStreakUpdate !== today) {
          if (allUsersUploaded) {
            newStreak += 1;
            console.log(`Group ${groupId}: Streak increased to ${newStreak}`);
          } else {
            newStreak = 0;
            console.log(`Group ${groupId}: Streak reset to 0`);
          }
        }

        updateData.streak = newStreak;

        // Update the group document
        return groupDoc.ref.update(updateData);
      } catch (error) {
        console.error(`Error processing group ${groupDoc.id}:`, error);
        throw error;
      }
    });

    await Promise.all(updatePromises);

    console.log('Successfully completed processing all groups');

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Successfully reset streaks and deleted images',
        groupsProcessed: groupsSnapshot.size
      })
    };
  } catch (error) {
    console.error('Fatal error in resetStreakAndDeleteImages:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Failed to process streaks and images',
        message: error.message
      })
    };
  }
};