"use client"

import { FC, useState } from 'react';
import { Button } from '@/components/ui/Button';
import BloodDeathKnightTalents from './BloodDeathKnightTalents';

const WoWTalentTreePage: FC = () => {
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSpec, setSelectedSpec] = useState('');

  const specs = [
    {
      class: 'Death Knight',
      specs: [
        { name: 'Blood', role: 'Tank' },
        { name: 'Frost', role: 'Melee DPS' },
        { name: 'Unholy', role: 'Melee DPS' },
      ],
      heroTalents: [
        { name: 'Deathbringer', role: 'Tank' },
        { name: 'Rider of the Apocalypse', role: 'Melee DPS' },
        { name: 'Unholy Frenzy', role: 'Melee DPS' },
      ],
    },
    {
      class: 'Demon Hunter',
      specs: [
        { name: 'Havoc', role: 'Melee DPS' },
        { name: 'Vengeance', role: 'Tank' },
      ],
      heroTalents: [
        { name: 'Aldrachi Reaver', role: 'Melee DPS' },
        { name: 'Vengeful Spirit', role: 'Tank' },
        { name: 'Fel Devastation', role: 'Melee DPS' },
      ],
    },
    {
      class: 'Druid',
      specs: [
        { name: 'Balance', role: 'Ranged DPS' },
        { name: 'Feral', role: 'Melee DPS' },
        { name: 'Guardian', role: 'Tank' },
        { name: 'Restoration', role: 'Healer' },
      ],
      heroTalents: [
        { name: 'Archdruid', role: 'Healer' },
        { name: 'Moonkin', role: 'Ranged DPS' },
        { name: 'Warden', role: 'Tank' },
        { name: 'Feral Fury', role: 'Melee DPS' },
      ],
    },
    {
      class: 'Evoker',
      specs: [
        { name: 'Devastation', role: 'Ranged DPS' },
        { name: 'Preservation', role: 'Healer' },
        { name: 'Augmentation', role: 'Support' },
      ],
      heroTalents: [
        { name: 'Augur', role: 'Support' },
        { name: 'Pyromancer', role: 'Ranged DPS' },
        { name: 'Elemental Mastery', role: 'Ranged DPS' },
      ],
    },
    {
      class: 'Hunter',
      specs: [
        { name: 'Beast Mastery', role: 'Ranged DPS' },
        { name: 'Marksmanship', role: 'Ranged DPS' },
        { name: 'Survival', role: 'Melee DPS' },
      ],
      heroTalents: [
        { name: 'Beastlord', role: 'Ranged DPS' },
        { name: 'Pack Leader', role: 'Melee DPS' },
        { name: 'Survivalist', role: 'Ranged DPS' },
      ],
    },
    {
      class: 'Mage',
      specs: [
        { name: 'Arcane', role: 'Ranged DPS' },
        { name: 'Fire', role: 'Ranged DPS' },
        { name: 'Frost', role: 'Ranged DPS' },
      ],
      heroTalents: [
        { name: 'Arcanist', role: 'Ranged DPS' },
        { name: 'Pyromancer', role: 'Ranged DPS' },
        { name: 'Cryomancer', role: 'Ranged DPS' },
      ],
    },
    {
      class: 'Monk',
      specs: [
        { name: 'Brewmaster', role: 'Tank' },
        { name: 'Mistweaver', role: 'Healer' },
        { name: 'Windwalker', role: 'Melee DPS' },
      ],
      heroTalents: [
        { name: 'Brewmaster', role: 'Tank' },
        { name: 'Mistdancer', role: 'Healer' },
        { name: 'Windwalker', role: 'Melee DPS' },
      ],
    },
    {
      class: 'Paladin',
      specs: [
        { name: 'Holy', role: 'Healer' },
        { name: 'Protection', role: 'Tank' },
        { name: 'Retribution', role: 'Melee DPS' },
      ],
      heroTalents: [
        { name: 'Crusader', role: 'Tank' },
        { name: 'Vindicator', role: 'Healer' },
        { name: 'Retribution', role: 'Melee DPS' },
      ],
    },
    {
      class: 'Priest',
      specs: [
        { name: 'Discipline', role: 'Healer' },
        { name: 'Holy', role: 'Healer' },
        { name: 'Shadow', role: 'Ranged DPS' },
      ],
      heroTalents: [
        { name: 'Inquisitor', role: 'Ranged DPS' },
        { name: 'Purifier', role: 'Healer' },
        { name: 'Shadow Weaver', role: 'Ranged DPS' },
      ],
    },
    {
      class: 'Rogue',
      specs: [
        { name: 'Assassination', role: 'Melee DPS' },
        { name: 'Outlaw', role: 'Melee DPS' },
        { name: 'Subtlety', role: 'Melee DPS' },
      ],
      heroTalents: [
        { name: 'Assassin', role: 'Melee DPS' },
        { name: 'Swashbuckler', role: 'Melee DPS' },
        { name: 'Shadowdancer', role: 'Melee DPS' },
      ],
    },
    {
      class: 'Shaman',
      specs: [
        { name: 'Elemental', role: 'Ranged DPS' },
        { name: 'Enhancement', role: 'Healer' },
        { name: 'Restoration', role: 'Healer' },
      ],
      heroTalents: [
        { name: 'Earthwarden', role: 'Healer' },
        { name: 'Spiritwalker', role: 'Healer' },
        { name: 'Witch Doctor', role: 'Ranged DPS' },
        { name: 'Elemental Fury', role: 'Ranged DPS' },
      ],
    },
    {
      class: 'Warlock',
      specs: [
        { name: 'Affliction', role: 'Ranged DPS' },
        { name: 'Demonology', role: 'Ranged DPS' },
        { name: 'Destruction', role: 'Ranged DPS' },
      ],
      heroTalents: [
        { name: 'Demonic', role: 'Ranged DPS' },
        { name: 'Soulweaver', role: 'Healer' },
        { name: 'Destruction', role: 'Ranged DPS' },
      ],
    },
    {
      class: 'Warrior',
      specs: [
        { name: 'Arms', role: 'Melee DPS' },
        { name: 'Fury', role: 'Melee DPS' },
        { name: 'Protection', role: 'Tank' },
      ],
      heroTalents: [
        { name: 'Berserker', role: 'Melee DPS' },
        { name: 'Vanguard', role: 'Tank' },
        { name: 'Battle Master', role: 'Melee DPS' },
      ],
    },
  ];

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-4">World of Warcraft Talent Tree</h1>
      <div className="mb-8">
        <label htmlFor="class-select" className="block text-lg font-medium mb-2">
          Select a class:
        </label>
        <select
          id="class-select"
          value={selectedClass}
          onChange={(e) => {
            setSelectedClass(e.target.value);
            setSelectedSpec('');
          }}
          className="w-full px-4 py-2 text-lg border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Choose a class</option>
          {specs.map((classObj) => (
            <option key={classObj.class} value={classObj.class}>
              {classObj.class}
            </option>
          ))}
        </select>
      </div>
      {selectedClass && (
        <div className="mb-8">
          <label htmlFor="spec-select" className="block text-lg font-medium mb-2">
            Select a specialization:
          </label>
          <select
            id="spec-select"
            value={selectedSpec}
            onChange={(e) => setSelectedSpec(e.target.value)}
            className="w-full px-4 py-2 text-lg border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Choose a spec</option>
            {specs
              .find((classObj) => classObj.class === selectedClass)
              ?.specs.map((spec) => (
                <option key={spec.name} value={spec.name}>
                  {spec.name} ({spec.role})
                </option>
              ))}
          </select>
        </div>
      )}
      {selectedClass === 'Death Knight' && selectedSpec === 'Blood' && (
        <BloodDeathKnightTalents />
      )}
    </div>
  );
};

export default WoWTalentTreePage;