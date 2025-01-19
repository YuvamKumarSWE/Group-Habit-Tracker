import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Clock from './Clock'; 

// HabitTrackerCard Component
function HabitTrackerCard({ group, onDelete }) {
  const handleDelete = (e) => {
    e.stopPropagation(); // Prevent event propagation to prevent navigating
    onDelete(group.id);  // Call the delete function
  };

  return (
    <div className="bg-lightPurple flex flex-col md:flex-col items-center backdrop-blur-3xl shadow-lg rounded-lg overflow-hidden w-full max-w-5xl mb-6">
      {/* Content */}
      <div className="p-2 flex flex-col gap-4 w-full md:w-4/5 text-darkText">
        <CardHeader>
          <CardTitle>{group.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-darkText">{group.streak} day streak</div>
        </CardContent>
      </div>

      {/* Link for Group Details */}
      <Link to={`/group/${group.id}`} className="flex items-center justify-center w-full h-full">
        {/* Empty div to make the whole card clickable */}
         <Button variant ="secondary" className='w-full mx-6'>Open</Button>
      </Link>

      {/* Delete Button */}
      <div className="flex items-center justify-center w-full h-full">
        <Button variant="secondary" onClick={handleDelete} className="w-full mx-6 my-4 text-red-500">Delete</Button>
      </div>
    </div>
  );
}

// DashboardPage Component
export default function DashboardPage() {
  const [groups, setGroups] = useState([]);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newGroup, setNewGroup] = useState({ name: '', streak: '', lastUpdated: '' });

  // Load groups from local storage on component mount
  useEffect(() => {
    const savedGroups = JSON.parse(localStorage.getItem('groups')) || [];
    setGroups(savedGroups);
  }, []);

  // Handle modal opening and closing
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Handle form submission
  const handleFormSubmit = (e) => {
    e.preventDefault();
    const newGroupData = { ...newGroup, id: groups.length + 1 };
    const updatedGroups = [...groups, newGroupData];
    
    // Update state and save to local storage
    setGroups(updatedGroups);
    localStorage.setItem('groups', JSON.stringify(updatedGroups));
    
    setNewGroup({ name: '', streak: '', lastUpdated: '' });
    closeModal();
  };

  // Delete group
  const handleDeleteGroup = (id) => {
    const updatedGroups = groups.filter(group => group.id !== id);
    setGroups(updatedGroups);
    localStorage.setItem('groups', JSON.stringify(updatedGroups));
  };

  return (
    <section className="bg-gradient-to-r bg-gradient-to-r from-violet-100 to-pink-100 h-screen w-screen">
    <div className="min-h-screen bg-gradient-to-r bg-gradient-to-r from-violet-100 to-pink-100">
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-2xl font-semibold text-darkText">Your Groups</h1>
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {groups.map((group) => (
              <div key={group.id} className="relative">
                <HabitTrackerCard
                  group={group}
                  onDelete={handleDeleteGroup}
                />
              </div>
            ))}
          </div>

          {/* Button to open the modal */}
          <div className="mt-8">
            <Button variant="secondary" onClick={openModal}>Create New Group</Button>
          </div>
        </div>
      </main>

      {/* Modal */}
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
              <div className="mb-4">
                <label htmlFor="streak" className="block text-sm font-medium text-gray-700">Streak (Days)</label>
                <input
                  type="number"
                  id="streak"
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                  value={newGroup.streak}
                  onChange={(e) => setNewGroup({ ...newGroup, streak: e.target.value })}
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="lastUpdated" className="block text-sm font-medium text-gray-700">Last Updated</label>
                <input
                  type="date"
                  id="lastUpdated"
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                  value={newGroup.lastUpdated}
                  onChange={(e) => setNewGroup({ ...newGroup, lastUpdated: e.target.value })}
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