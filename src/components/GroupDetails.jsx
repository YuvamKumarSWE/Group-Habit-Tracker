import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db, auth } from '../firebase.js';
import { doc, getDoc, updateDoc, onSnapshot } from 'firebase/firestore';

// Main component to display group details
export default function GroupDetails() {
  const { groupId } = useParams(); // Retrieve the groupId from the URL parameters
  const [group, setGroup] = useState(null); // State to store group data
  const [users, setUsers] = useState([]); // State to store user data
  const [uploadedImages, setUploadedImages] = useState([]); // State to store uploaded images
  const [hasUploadedToday, setHasUploadedToday] = useState(false); // State to track if the user has uploaded an image today

  useEffect(() => {
    const groupRef = doc(db, 'groups', groupId); // Reference to the group document in Firestore
    const currentUserId = auth.currentUser?.uid; // Get the current user's ID

    // Function to check if the user has uploaded an image today
    const checkTodayUpload = async () => {
      const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
      const groupDoc = await getDoc(groupRef); // Fetch the group document
      const groupData = groupDoc.data(); // Extract data from the document
      const existingImage = groupData?.uploadedImages?.find(
        (img) => img.userId === currentUserId && img.date === today
      );
      setHasUploadedToday(!!existingImage); // Update state based on whether an image was found
    };

    if (currentUserId) {
      checkTodayUpload(); // Check today's upload if the user is logged in
    }

    // Set up a real-time listener for the group document
    const unsubscribe = onSnapshot(groupRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const data = docSnapshot.data(); // Extract data from the snapshot
        setGroup(data); // Update group state
        setUploadedImages(data.uploadedImages || []); // Update uploaded images state
        fetchUsers(data.userIds || []); // Fetch user data
      }
    });

    return () => unsubscribe(); // Clean up the listener on component unmount
  }, [groupId]);

  // Function to fetch user data based on user IDs
  const fetchUsers = async (userIds) => {
    const userDocs = await Promise.all(
      userIds.map((id) => getDoc(doc(db, 'users', id))) // Fetch each user document
    );
    setUsers(userDocs.map((doc) => ({ id: doc.id, ...doc.data() }))); // Update users state
  };

  // Function to handle image upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0]; // Get the selected file
    if (!file || !file.type.startsWith('image/') || file.size > 5 * 1024 * 1024) {
      alert('Invalid file. Please upload an image under 5MB.'); // Validate file type and size
      return;
    }

    const reader = new FileReader(); // Create a FileReader to read the file
    reader.onload = async (event) => {
      const img = new Image(); // Create an Image object
      img.src = event.target.result; // Set the image source to the file data
      img.onload = async () => {
        const canvas = document.createElement('canvas'); // Create a canvas element
        const MAX_WIDTH = 1200; // Define maximum width for the image
        const scaleSize = MAX_WIDTH / img.width; // Calculate scale size
        canvas.width = MAX_WIDTH; // Set canvas width
        canvas.height = img.height * scaleSize; // Set canvas height

        const ctx = canvas.getContext('2d'); // Get the canvas context
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height); // Draw the image on the canvas

        const dataUrl = canvas.toDataURL('image/jpeg', 0.8); // Convert canvas to a data URL
        const userId = auth.currentUser.uid; // Get the current user's ID

        const today = new Date().toISOString().split('T')[0]; // Get today's date
        const existingImage = uploadedImages.find(
          (img) => img.userId === userId && img.date === today
        );

        try {
          const groupRef = doc(db, 'groups', groupId); // Reference to the group document
          const updatedImages = existingImage
            ? uploadedImages.map((img) =>
                img.userId === userId ? { ...img, image: dataUrl } : img
              )
            : [
                ...uploadedImages,
                { userId, image: dataUrl, date: today },
              ];

          await updateDoc(groupRef, { uploadedImages: updatedImages }); // Update the document with new images

          setUploadedImages(updatedImages); // Update state with new images
          setHasUploadedToday(true); // Set upload status to true
        } catch (error) {
          console.error('Error updating group data:', error); // Log any errors
          alert('Failed to update group data. Please try again.'); // Alert the user on failure
        }
      };
    };
    reader.readAsDataURL(file); // Read the file as a data URL
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-100 to-pink-100">
      <div className="container mx-auto p-4 text-customPurple">
        <h1 className="text-2xl font-bold mb-4">Group Details</h1>
        {group && (
          <div>
            <h2 className="text-xl font-semibold">{group.name}</h2>
            <p className="mt-2">Streak: {group.streak || 0} days</p>

            {/* Conditional rendering for image upload input */}
            {auth.currentUser?.uid && !hasUploadedToday && (
              <input
                type="file"
                onChange={handleImageUpload}
                accept="image/*"
                className="mt-4 p-2 border rounded-2xl border-gray-300"
              />
            )}

            {/* Message displayed if the user has uploaded today */}
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
                        src={uploadedImage.image || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iMTIiIHZpZXdCb3g9IjAgMCAxMiAxMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjEyIiBoZWlnaHQ9IjEyIiByeD0iMiIgZmlsbD0iIzAwMCIvPgo8L3N2Zz4='}
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