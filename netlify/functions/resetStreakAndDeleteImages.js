const { initializeApp, getApps, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

// Initialize Firebase Admin SDK
if (!getApps().length) {
  try {
    initializeApp({
      credential: cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY))
    });
  } catch (error) {
    console.error('Firebase initialization failed:', error);
    throw error;
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
        const lastStreakUpdate = groupData.lastStreakUpdate;

        console.log(`Processing group ${groupId}: ${userIds.length} users, ${uploadedImages.length} images`);

        // Check if all users uploaded today
        const hasAllUploaded = userIds.every((userId) =>
          uploadedImages.some(
            (img) => img.userId === userId && img.date === today
          )
        );

        let newStreak = groupData.streak || 0;
        
        // Only update streak if it hasn't been updated today
        if (lastStreakUpdate !== today) {
          if (hasAllUploaded) {
            newStreak += 1;
            console.log(`Group ${groupId}: Streak increased to ${newStreak}`);
          } else {
            newStreak = 0;
            console.log(`Group ${groupId}: Streak reset to 0`);
          }
        }

        // Update the group data
        return groupDoc.ref.update({
          uploadedImages: [],
          streak: newStreak,
          lastStreakUpdate: today,
        });
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