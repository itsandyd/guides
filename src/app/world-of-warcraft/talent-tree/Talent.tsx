import { FC, ReactNode } from 'react';

interface TalentProps {
  name: string;
  description: string | ReactNode;
  cooldown?: string;
  cost?: string;
  range?: string;
  channel?: string;
  charges?: number;
}

const Talent: FC<TalentProps> = ({ name, description, cooldown, cost, range, channel, charges }) => {
  return (
    <div className="talent relative bg-gray-800 p-4 rounded-lg shadow-md">
      <div className="talent-icon absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center text-white text-lg font-semibold">
        {charges || ''}
      </div>
      <div className="talent-info pt-8">
        <h4 className="talent-name text-center text-xl font-semibold text-white mb-2">{name}</h4>
        <div className="talent-description text-gray-300 text-sm mb-2">{description}</div>
        {cooldown && <p className="talent-cooldown text-gray-400 text-xs">Cooldown: {cooldown}</p>}
        {cost && <p className="talent-cost text-gray-400 text-xs">Cost: {cost}</p>}
        {range && <p className="talent-range text-gray-400 text-xs">Range: {range}</p>}
        {channel && <p className="talent-channel text-gray-400 text-xs">Channel: {channel}</p>}
      </div>
    </div>
  );
};

export default Talent;