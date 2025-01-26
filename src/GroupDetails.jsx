import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { db, auth } from './firebase.js'; // Ensure Firebase Auth is initialized
import { doc, getDoc, updateDoc, onSnapshot } from 'firebase/firestore';

export default function GroupDetails() {
  const { groupId } = useParams();
  const [group, setGroup] = useState(null);
  const [users, setUsers] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const groupRef = doc(db, 'groups', groupId);

    // Subscribe to group changes
    const unsubscribe = onSnapshot(groupRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        setGroup(data);
        setUploadedImages(data.uploadedImages || []);
        setStreak(data.streak || 0);
        fetchUsers(data.userIds || []);
      }
    });

    // Reset on app load if needed
    const resetIfNeeded = async () => {
      const now = new Date();
      const today = now.toISOString().split('T')[0];

      const groupSnap = await getDoc(groupRef);
      if (groupSnap.exists()) {
        const groupData = groupSnap.data();

        if (groupData.lastUpdated !== today) {
          const allUploaded = groupData.userIds.every((id) =>
            groupData.uploadedImages.some((img) => img.userId === id)
          );

          await updateDoc(groupRef, {
            uploadedImages: [],
            streak: allUploaded ? groupData.streak + 1 : 0,
            lastUpdated: today,
          });
        }
      }
    };

    resetIfNeeded();

    // Midnight check
    const midnightCheck = setInterval(checkAndResetAtMidnight, 60000); // Check every minute

    return () => {
      unsubscribe();
      clearInterval(midnightCheck);
    };
  }, [groupId]);

  const fetchUsers = async (userIds) => {
    const userDocs = await Promise.all(
      userIds.map((id) => getDoc(doc(db, 'users', id)))
    );
    const userData = userDocs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setUsers(userData);
  };

  const checkAndResetAtMidnight = async () => {
    const now = new Date();
    const today = now.toISOString().split('T')[0];

    if (now.getHours() === 0 && now.getMinutes() === 0) {
      const groupRef = doc(db, 'groups', groupId);
      const groupSnap = await getDoc(groupRef);

      if (groupSnap.exists()) {
        const groupData = groupSnap.data();

        if (groupData.lastUpdated !== today) {
          const allUploaded = groupData.userIds.every((id) =>
            groupData.uploadedImages.some((img) => img.userId === id)
          );

          await updateDoc(groupRef, {
            uploadedImages: [],
            streak: allUploaded ? groupData.streak + 1 : 0,
            lastUpdated: today,
          });
        }
      }
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result;

        const userId = auth.currentUser.uid;
        const alreadyUploaded = uploadedImages.some((img) => img.userId === userId);
        if (alreadyUploaded) {
          alert('You have already uploaded an image today!');
          return;
        }

        const updatedImages = [...uploadedImages, { userId, image: base64String }];
        const allUploaded = group.userIds.every((id) =>
          updatedImages.some((img) => img.userId === id)
        );

        const today = new Date().toISOString().split('T')[0];
        let newStreak = streak;

        if (allUploaded && group.lastUpdated === today) {
          newStreak += 1; // Increment streak if all uploaded today
        }

        const groupRef = doc(db, 'groups', groupId);
        await updateDoc(groupRef, {
          uploadedImages: updatedImages,
          streak: newStreak,
          lastUpdated: today,
        });

        setUploadedImages(updatedImages);
        setStreak(newStreak);

        if (allUploaded) {
          alert('All users have uploaded their images! Streak increased.');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Group Details</h1>
      {group && (
        <div>
          <h2 className="text-xl font-semibold">{group.name}</h2>
          <p className="mt-2">Streak: {streak} days</p>

          <input
            type="file"
            onChange={handleImageUpload}
            className="mt-4 p-2 border rounded"
          />

          <div className="mt-6">
            <h3 className="text-lg font-semibold">Group Members</h3>
            {users.map((user) => {
              const uploadedImage = uploadedImages.find((img) => img.userId === user.id);
              return (
                <div key={user.id} className="flex items-center mb-4">
                  <div className="mr-4">
                    <img
                      src={uploadedImage ? uploadedImage.image : '/default-avatar.png'}
                      alt={user.name}
                      className="w-12 h-12 rounded-full"
                    />
                  </div>
                  <span className="text-lg">{user.name}</span>
                </div>
              );
            })}
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold">Uploaded Images</h3>
            <div className="flex flex-wrap">
              {uploadedImages.map((img, index) => (
                <img
                  key={index}
                  src={img.image}
                  alt={`Upload ${index}`}
                  className="w-24 h-24 m-2 object-cover rounded"
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}