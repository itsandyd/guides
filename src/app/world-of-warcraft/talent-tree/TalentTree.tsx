import { FC, ReactNode } from 'react';

interface TalentTreeProps {
  children: ReactNode;
}

const TalentTree: FC<TalentTreeProps> = ({ children }) => {
  return <div className="tree-container grid grid-cols-4 gap-4 bg-gray-900 p-6 rounded-xl shadow-lg">{children}</div>;
};

export default TalentTree;