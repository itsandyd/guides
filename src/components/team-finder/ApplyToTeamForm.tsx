import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Label } from '@/components/ui/Label';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/Textarea";
import { DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/Dialog';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";

const classesAndSpecs = {
    "Death Knight": {
        "Blood Death Knight": ["Deathbringer", "San'layn"],
        "Frost Death Knight": ["Deathbringer"],
        "Unholy Death Knight": ["San'layn"],
    },
    "Demon Hunter": {
        "Havoc Demon Hunter": ["Aldrachi Reaver", "Fel-Scarred"],
        "Vengeance Demon Hunter": ["Aldrachi Reaver"],
    },
    "Druid": {
        "Balance Druid": [],
        "Feral Druid": ["Wildstalker"],
        "Guardian Druid": ["Druid of the Claw"],
        "Restoration Druid": ["Keeper of the Grove", "Wildstalker"],
    },
    "Evoker": {
        "Augmentation Evoker": ["Chronowarden", "Scalecommander"],
        "Devastation Evoker": ["Scalecommander"],
        "Preservation Evoker": [],
    },
    "Hunter": {
        "Beast Mastery Hunter": ["Dark Ranger"],
        "Marksmanship Hunter": ["Sentinel"],
        "Survival Hunter": [],
    },
    "Mage": {
        "Arcane Mage": ["Sunfury", "Spellslinger"],
        "Fire Mage": ["Frostfire"],
        "Frost Mage": ["Frostfire"],
    },
    "Monk": {
        "Brewmaster Monk": ["Master of Harmony"],
        "Mistweaver Monk": [],
        "Windwalker Monk": [],
    },
    "Paladin": {
        "Holy Paladin": ["Lightsmith"],
        "Protection Paladin": ["Lightsmith"],
        "Retribution Paladin": [],
    },
    "Priest": {
        "Discipline Priest": ["Voidweaver"],
        "Holy Priest": ["Oracle", "Archon"],
        "Shadow Priest": ["Archon"],
    },
    "Rogue": {
        "Assassination Rogue": ["Deathstalker", "Fatebound"],
        "Outlaw Rogue": ["Trickster"],
        "Subtlety Rogue": ["Deathstalker"],
    },
    "Shaman": {
        "Elemental Shaman": ["Farseer"],
        "Enhancement Shaman": ["Stormbringer"],
        "Restoration Shaman": [],
    },
    "Warlock": {
        "Affliction Warlock": ["Hellcaller", "Soul Harvester"],
        "Demonology Warlock": ["Diabolist", "Soul Harvester"],
        "Destruction Warlock": ["Diabolist", "Hellcaller"],
    },
    "Warrior": {
        "Arms Warrior": ["Colossus", "Slayer"],
        "Fury Warrior": ["Mountain Thane"],
        "Protection Warrior": ["Mountain Thane"],
    },
};

type WoWClass = keyof typeof classesAndSpecs;

interface TeamApplication {
    teamId: string;
    applicantName: string;
    characterName: string;
    characterClass: WoWClass;
    characterSpec: string;
    experience: string;
    availability: string;
    additionalInfo: string;
}

interface Character {
    id: string;
    name: string;
    class: string;
    spec: string;
}

interface Team {
    id?: string;
    name: string;
    about: string;
    aboutDetailed?: string;
    schedule: string;
    roles: {
        tank: number;
        healer: number;
        dps: number;
    };
    progress: string;
    requirements: string;
    classesAndSpecs: Record<string, string[]>;
    leaderName: string;
    contactInfo: string;
    creatorId: string;
}

interface ApplyToTeamFormProps {
    team: Team;
    onSubmit: (application: TeamApplication) => void;
}

const ApplyToTeamForm: React.FC<ApplyToTeamFormProps> = ({ team, onSubmit }) => {
    const [formData, setFormData] = useState<TeamApplication>({
        teamId: team.id!,
        applicantName: "",
        characterName: "",
        characterClass: Object.keys(classesAndSpecs)[0] as WoWClass,
        characterSpec: "",
        experience: "",
        availability: "",
        additionalInfo: "",
    });
    const [isExperienceExpanded, setIsExperienceExpanded] = useState(false);
    const [isAdditionalInfoExpanded, setIsAdditionalInfoExpanded] = useState(false);
    const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
    const { data: session } = useSession();
    const [characters, setCharacters] = useState<Character[]>([]);

    useEffect(() => {
        const fetchCharacters = async () => {
            if (session?.user?.id) {
                try {
                    const response = await axios.get(`/api/characters?userId=${session.user.id}`);
                    setCharacters(response.data);
                } catch (error) {
                    console.error('Error fetching characters:', error);
                }
            }
        };
        fetchCharacters();
    }, [session]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleClassChange = (value: string) => {
        if (value in classesAndSpecs) {
            setFormData(prev => ({
                ...prev,
                characterClass: value as WoWClass,
                characterSpec: "",
            }));
        }
    };

    const handleSpecChange = (value: string) => {
        setFormData(prev => ({ ...prev, characterSpec: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <DialogHeader>
                <DialogTitle>Apply to Join {team.name}</DialogTitle>
                <DialogDescription>
                    Fill out the application form below to apply for this raid team.
                </DialogDescription>
            </DialogHeader>
            <ScrollArea className="h-[60vh] pr-4">
                <div className="space-y-4">
                    <div>
                        <Label htmlFor="applicantName">Your Name</Label>
                        <Input id="applicantName" name="applicantName" value={formData.applicantName} onChange={handleChange} required />
                    </div>
                    <div>
                        <Label htmlFor="characterSelect">Select Character</Label>
                        <Select onValueChange={(value) => {
                            const character = characters.find(c => c.id === value);
                            if (character) {
                                setSelectedCharacter(character);
                                setFormData(prev => ({
                                    ...prev,
                                    characterName: character.name,
                                    characterClass: character.class as WoWClass,
                                    characterSpec: character.spec,
                                }));
                            }
                        }}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a character" />
                            </SelectTrigger>
                            <SelectContent>
                                {characters.map(character => (
                                    <SelectItem key={character.id} value={character.id}>
                                        {character.name} - {character.class} ({character.spec})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label htmlFor="characterName">Character Name</Label>
                        <Input id="characterName" name="characterName" value={formData.characterName} onChange={handleChange} required />
                    </div>
                    <div>
                        <Label htmlFor="characterClass">Class</Label>
                        <Select name="characterClass" value={formData.characterClass} onValueChange={handleClassChange}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a class" />
                            </SelectTrigger>
                            <SelectContent>
                                {Object.keys(classesAndSpecs).map(className => (
                                    <SelectItem key={className} value={className}>
                                        {className}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label htmlFor="characterSpec">Spec</Label>
                        <Select name="characterSpec" value={formData.characterSpec} onValueChange={handleSpecChange}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a spec" />
                            </SelectTrigger>
                            <SelectContent>
                                {Object.entries(classesAndSpecs[formData.characterClass] as Record<string, string[]>).map(([spec, heroSpecs]) => (
                                    <SelectItem key={spec} value={spec}>
                                        {spec}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label htmlFor="experience">Experience</Label>
                        <Textarea 
                            id="experience" 
                            name="experience" 
                            value={formData.experience} 
                            onChange={handleChange} 
                            className={isExperienceExpanded ? "h-40" : "h-20"}
                        />
                        <Button type="button" onClick={() => setIsExperienceExpanded(!isExperienceExpanded)}>
                            {isExperienceExpanded ? "Collapse" : "Expand"}
                        </Button>
                    </div>
                    <div>
                        <Label htmlFor="availability">Availability</Label>
                        <Input id="availability" name="availability" value={formData.availability} onChange={handleChange} required />
                    </div>
                    <div>
                        <Label htmlFor="additionalInfo">Additional Information</Label>
                        <Textarea 
                            id="additionalInfo" 
                            name="additionalInfo" 
                            value={formData.additionalInfo} 
                            onChange={handleChange} 
                            className={isAdditionalInfoExpanded ? "h-40" : "h-20"}
                        />
                        <Button type="button" onClick={() => setIsAdditionalInfoExpanded(!isAdditionalInfoExpanded)}>
                            {isAdditionalInfoExpanded ? "Collapse" : "Expand"}
                        </Button>
                    </div>
                </div>
            </ScrollArea>
            <DialogFooter>
                <Button type="submit">Submit Application</Button>
            </DialogFooter>
        </form>
    );
};

export default ApplyToTeamForm;