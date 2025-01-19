import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button'; // Adjust the path
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// HabitTrackerCard Component
function HabitTrackerCard({ groupName, streak, lastUpdated }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{groupName}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{streak} day streak</div>
        <div className="text-sm text-gray-500">Last updated: {lastUpdated}</div>
      </CardContent>
    </Card>
  );
}

// Mock data for groups
const mockGroups = [
  { id: 1, name: 'Morning Workout', streak: 5, lastUpdated: '2023-05-15' },
  { id: 2, name: 'Daily Reading', streak: 12, lastUpdated: '2023-05-15' },
  { id: 3, name: 'Healthy Eating', streak: 3, lastUpdated: '2023-05-14' },
];

// DashboardPage Component
export default function DashboardPage() {
  const [groups, setGroups] = useState(mockGroups);

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-2xl font-semibold text-gray-900">Your Groups</h1>
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {groups.map((group) => (
              <Link key={group.id} to={`/group/${group.id}`}>
                <HabitTrackerCard
                  groupName={group.name}
                  streak={group.streak}
                  lastUpdated={group.lastUpdated}
                />
              </Link>
            ))}
          </div>
          <div className="mt-8">
            <Button>Create New Group</Button>
          </div>
        </div>
      </main>
    </div>
  );
}