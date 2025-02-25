import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db, auth } from '../firebase.js';
import { doc, getDoc, updateDoc, onSnapshot } from 'firebase/firestore';

export default function GroupDetails() {
  const { groupId } = useParams();
  const [group, setGroup] = useState(null);
  const [users, setUsers] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [hasUploadedToday, setHasUploadedToday] = useState(false);

  useEffect(() => {
    const groupRef = doc(db, 'groups', groupId);
    const currentUserId = auth.currentUser?.uid;

    const checkTodayUpload = async () => {
      const today = new Date().toISOString().split('T')[0];
      const groupDoc = await getDoc(groupRef);
      const groupData = groupDoc.data();
      const existingImage = groupData?.uploadedImages?.find(
        (img) => img.userId === currentUserId && img.date === today
      );
      setHasUploadedToday(!!existingImage);
    };

    if (currentUserId) {
      checkTodayUpload();
    }

    const unsubscribe = onSnapshot(groupRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        setGroup(data);
        setUploadedImages(data.uploadedImages || []);
        fetchUsers(data.userIds || []);
      }
    });

    return () => unsubscribe();
  }, [groupId]);

  const fetchUsers = async (userIds) => {
    const userDocs = await Promise.all(
      userIds.map((id) => getDoc(doc(db, 'users', id)))
    );
    setUsers(userDocs.map((doc) => ({ id: doc.id, ...doc.data() })));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith('image/') || file.size > 5 * 1024 * 1024) {
      alert('Invalid file. Please upload an image under 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = async () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1200;
        const scaleSize = MAX_WIDTH / img.width;
        canvas.width = MAX_WIDTH;
        canvas.height = img.height * scaleSize;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        const userId = auth.currentUser.uid;

        const today = new Date().toISOString().split('T')[0];
        const existingImage = uploadedImages.find(
          (img) => img.userId === userId && img.date === today
        );

        try {
          const groupRef = doc(db, 'groups', groupId);
          const updatedImages = existingImage
            ? uploadedImages.map((img) =>
                img.userId === userId ? { ...img, image: dataUrl } : img
              )
            : [
                ...uploadedImages,
                { userId, image: dataUrl, date: today },
              ];

          await updateDoc(groupRef, { uploadedImages: updatedImages });

          setUploadedImages(updatedImages);
          setHasUploadedToday(true);
        } catch (error) {
          console.error('Error updating group data:', error);
          alert('Failed to update group data. Please try again.');
        }
      };
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-100 to-pink-100">
      <div className="container mx-auto p-4 text-customPurple">
        <h1 className="text-2xl font-bold mb-4">Group Details</h1>
        {group && (
          <div>
            <h2 className="text-xl font-semibold">{group.name}</h2>
            <p className="mt-2">Streak: {group.streak || 0} days</p>

            {auth.currentUser?.uid && !hasUploadedToday && (
              <input
                type="file"
                onChange={handleImageUpload}
                accept="image/*"
                className="mt-4 p-2 border rounded-2xl border-gray-300"
              />
            )}

            {hasUploadedToday && (
              <p className="mt-4 text-green-500">Thank you for your daily contribution!</p>
            )}

            <div className="mt-6">
              <h3 className="text-lg font-semibold">Group Members</h3>
              {users.map((user) => {
                const uploadedImage = uploadedImages.find(
                  (img) => img.userId === user.id
                ) || {}; 
                return (
                  <div key={user.id} className="flex items-center mb-4">
                    <div className="mr-4">
                      <img
                        src={uploadedImage.image || '/default-avatar.png'}
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
                      <p className="text-sm text-gray-500">
                        Uploaded: {new Date(uploadedImage.date).toLocaleDateString()}
                      </p>
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