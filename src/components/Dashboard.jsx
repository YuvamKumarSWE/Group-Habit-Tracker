import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { db, auth } from '@/firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, query, where, updateDoc, arrayUnion } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import HabitTrackerCard from './HabitTrackerCard';

export default function DashboardPage() {
  const [groups, setGroups] = useState([]);
  const [user, setUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newGroup, setNewGroup] = useState({ name: '', groupCode: '' });
  const [joinGroupCode, setJoinGroupCode] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const fetchGroups = async () => {
          const q = query(collection(db, "groups"), where("userIds", "array-contains", currentUser.uid));
          const querySnapshot = await getDocs(q);
          const groupsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setGroups(groupsData);
        };
        fetchGroups();
      } else {
        setUser(null);
        setGroups([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    const groupCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    const newGroupData = { ...newGroup, groupCode, userIds: [user.uid], streak: 0 };

    const docRef = await addDoc(collection(db, "groups"), newGroupData);
    setGroups([...groups, { id: docRef.id, ...newGroupData }]);
    setNewGroup({ name: '', groupCode: '' });
    closeModal();
  };

  const handleJoinGroup = async (e) => {
    e.preventDefault();
    if (!user || !joinGroupCode) return;

    const q = query(collection(db, "groups"), where("groupCode", "==", joinGroupCode));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const groupDoc = querySnapshot.docs[0];
      const groupRef = doc(db, "groups", groupDoc.id);

      await updateDoc(groupRef, {
        userIds: arrayUnion(user.uid),
      });

      setGroups([...groups, { id: groupDoc.id, ...groupDoc.data() }]);
      setJoinGroupCode('');
      alert('Successfully joined the group!');
    } else {
      alert('Group not found!');
    }
  };

  const handleDeleteGroup = async (id) => {
    await deleteDoc(doc(db, "groups", id));
    setGroups(groups.filter(group => group.id !== id));
  };

  return (
    <section className="bg-gradient-to-r from-violet-100 to-pink-100 h-screen w-screen">
      <div className="min-h-screen bg-gradient-to-r from-violet-100 to-pink-100">
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <h1 className="text-2xl font-semibold text-darkText">Your Groups</h1>
            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {groups.map((group) => (
                <HabitTrackerCard
                  key={group.id}
                  group={group}
                  onDelete={handleDeleteGroup}
                  onJoin={handleJoinGroup}
                />
              ))}
            </div>
            <div className="mt-8 flex gap-4">
              <Button variant="secondary" onClick={openModal}>Create New Group</Button>
              <form onSubmit={handleJoinGroup} className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Enter Group Code"
                  value={joinGroupCode}
                  onChange={(e) => setJoinGroupCode(e.target.value)}
                  className="p-2 border border-gray-300 rounded-md"
                  required
                />
                <Button type="submit">Join Group</Button>
              </form>
            </div>
          </div>
        </main>
        {isModalOpen && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-8 rounded-lg w-1/3">
              <h2 className="text-2xl font-semibold mb-4">Create New Group</h2>
              <form onSubmit={handleFormSubmit}>
                <div className="mb-4">
                  <label htmlFor="name" className="block text-sm font-medium text-darkText">Group Name</label>
                  <input
                    type="text"
                    id="name"
                    className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                    value={newGroup.name}
                    onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
                    required
                  />
                </div>
                <div className="flex justify-end">
                  <Button type="button" onClick={closeModal} className="mr-4">Cancel</Button>
                  <Button type="submit">Create Group</Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}