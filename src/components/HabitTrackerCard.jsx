import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

function HabitTrackerCard({ group, onDelete, onJoin }) {
  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(group.id);
  };

  const handleJoin = (e) => {
    e.stopPropagation();
    onJoin(group.id);
  };

  return (
    <div className="bg-lightPurple flex flex-col md:flex-col items-center backdrop-blur-3xl shadow-lg rounded-lg overflow-hidden w-full max-w-5xl mb-6">
      <div className="p-2 flex flex-col gap-4 w-full md:w-4/5 text-darkText">
        <CardHeader>
          <CardTitle>{group.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-darkText">{group.streak} day streak</div>
          <div className="text-lg text-gray-500">Group Code: {group.groupCode}</div>
        </CardContent>
      </div>
      <Link to={`/group/${group.id}`} className="flex items-center justify-center w-full h-full">
        <Button variant="secondary" className="w-full mx-6">Open</Button>
      </Link>
      <div className="flex items-center justify-center w-full h-full">
        <Button variant="secondary" onClick={handleJoin} className="w-full mx-6 my-4">Join</Button>
        <Button variant="secondary" onClick={handleDelete} className="w-full mx-6 my-4 text-red-500">Delete</Button>
      </div>
    </div>
  );
}

export default HabitTrackerCard;