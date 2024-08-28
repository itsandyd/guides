import { FC, ReactNode } from 'react';

interface TalentRowProps {
  children: ReactNode;
}

const TalentRow: FC<TalentRowProps> = ({ children }) => {
  return <div className="talent-row contents">{children}</div>;
};

export default TalentRow;