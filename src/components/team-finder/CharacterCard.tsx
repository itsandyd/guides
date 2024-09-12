import { Character } from "@prisma/client";

const CharacterCard: React.FC<{ character: Character }> = ({ character }) => {
    return (
        <div className="bg-white p-4 rounded shadow">
            <h4 className="text-lg font-semibold">{character.name}</h4>
            <p>{character.class} - {character.spec}</p>
        </div>
    );
};

export default CharacterCard;
