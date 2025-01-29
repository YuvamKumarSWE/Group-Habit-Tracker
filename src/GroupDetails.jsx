import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db, auth } from './firebase.js'; // Ensure Firebase Auth is initialized
import { doc, getDoc, updateDoc, onSnapshot, serverTimestamp } from 'firebase/firestore';

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

    return () => {
      unsubscribe();
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

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    
    // Validate file
    if (!file) {
      alert('No file selected');
      return;
    }
  
    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }
  
    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File is too large. Please select an image under 5MB');
      return;
    }
  
    const reader = new FileReader();
    reader.onload = async (event) => {
      // Compress image before upload
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1200;
        const scaleSize = MAX_WIDTH / img.width;
        canvas.width = MAX_WIDTH;
        canvas.height = img.height * scaleSize;
  
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        
        // Create async function to handle the update
        const updateGroupData = async () => {
          const userId = auth.currentUser.uid;
          const existingImage = uploadedImages.find((img) => img.userId === userId);
      
          const updatedImages = existingImage
            ? uploadedImages.map((img) =>
                img.userId === userId ? { userId, image: dataUrl } : img
              )
            : [...uploadedImages, { userId, image: dataUrl }];
      
          const today = new Date().toISOString().split('T')[0];
          const allUploaded = group.userIds &&
            group.userIds.every((id) => updatedImages.some((img) => img.userId === id));
      
          let newStreak = streak;
          if (!existingImage && allUploaded) {
            newStreak += 1;
          }
      
          try {
            await updateDoc(doc(db, 'groups', groupId), {
              uploadedImages: updatedImages,
              streak: newStreak,
              lastUpdated: today,
            });
      
            setUploadedImages(updatedImages);
            setStreak(newStreak);
      
            if (allUploaded && !existingImage) {
              alert('All users have uploaded their images! Streak increased.');
            }
          } catch (error) {
            console.error('Error updating group data:', error);
            alert('Failed to update group data. Please try again.');
          }
        };
      
        // Call the async function
        updateGroupData();
      };
    };
    reader.readAsDataURL(file);
  };

  const resetIfNeeded = async () => {
    const groupRef = doc(db, 'groups', groupId);
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    
    const groupSnap = await getDoc(groupRef);
    if (groupSnap.exists()) {
      const groupData = groupSnap.data();
      const lastUpdated = groupData.lastUpdated || '';
  
      // Check if any user missed uploading their image
      const allUsersUploaded = groupData.userIds.every(userId => 
        groupData.uploadedImages.some(img => img.userId === userId)
      );
  
      // Reset if not everyone uploaded
      if (!allUsersUploaded) {
        await updateDoc(groupRef, {
          uploadedImages: [], // Reset images
          streak: 0, // Reset streak to 0
          lastUpdated: today,
        });
  
        setUploadedImages([]); // Update UI state
        setStreak(0); // Update streak locally
      } else {
        // If everyone uploaded, just clear images but maintain streak
        await updateDoc(groupRef, {
          uploadedImages: [],
          lastUpdated: today,
        });
        
        setUploadedImages([]);
      }
    }
  };
  
  // Set up the midnight reset timer
  useEffect(() => {
    const scheduleNextReset = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      
      const msUntilMidnight = tomorrow - now;
      
      return setTimeout(() => {
        resetIfNeeded();
        // Set up the next day's reset
        const dailyReset = setInterval(resetIfNeeded, 24 * 60 * 60 * 1000);
        return () => clearInterval(dailyReset);
      }, msUntilMidnight);
    };
  
    const timeoutId = scheduleNextReset();
    return () => clearTimeout(timeoutId);
  }, [groupId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-100 to-pink-100">
      <div className="container mx-auto p-4 text-customPurple">
        <h1 className="text-2xl font-bold mb-4">Group Details</h1>
        {group && (
          <div>
            <h2 className="text-xl font-semibold">{group.name}</h2>
            <p className="mt-2">Streak: {streak} days</p>

            <input
              type="file"
              onChange={handleImageUpload}
              accept="image/*;capture=camera"
              capture="environment"
              className="mt-4 p-2 border rounded-2xl border-gray-300"
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

            <div className="mt-10 bg-gradient-to-br from-violet-100 to-pink-100 p-4 text-customPurple">
              <h3 className="text-lg font-semibold">Uploaded Images</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-8">
                {uploadedImages.map((uploadedImage) => {
                  const user = users.find((u) => u.id === uploadedImage.userId);
                  return (
                    <div key={uploadedImage.userId} className="flex flex-col items-center">
                      <img
                        src={uploadedImage.image}
                        alt={`${user?.name}'s upload`}
                        className="w-64 h-64 object-cover rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
                      />
                      <p className="mt-2 font-medium">{user?.name}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
