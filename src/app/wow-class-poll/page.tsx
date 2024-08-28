"use client"

import { FC, useState } from 'react';
import { Button } from '@/components/ui/Button';

const WoWClassPollPage: FC = () => {
  const classes = [
    'Death Knight',
    'Demon Hunter',
    'Druid',
    'Hunter',
    'Mage',
    'Monk',
    'Paladin',
    'Priest',
    'Rogue',
    'Shaman',
    'Warlock',
    'Warrior',
  ];

  const [selectedClass, setSelectedClass] = useState('');
  const [hasVoted, setHasVoted] = useState(false);

  const handleVote = () => {
    // TODO: Implement vote submission logic
    setHasVoted(true);
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-4">Which class will you play in WoW Shadowlands Dragonflight?</h1>
      {!hasVoted ? (
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {classes.map((className) => (
              <Button
                key={className}
                onClick={() => setSelectedClass(className)}
                variant={selectedClass === className ? 'default' : 'outline'}
              >
                {className}
              </Button>
            ))}
          </div>
          <Button onClick={handleVote} disabled={!selectedClass} className="mt-8">
            Vote
          </Button>
        </div>
      ) : (
        <p className="text-xl">Thank you for voting!</p>
      )}
    </div>
  );
};

export default WoWClassPollPage;