import React, { useState } from 'react';
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Label } from '@/components/ui/Label';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/Textarea";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp } from "lucide-react";
import { DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/Dialog';

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

interface TeamFormProps {
    team?: Team;
    onSave: (team: Team) => void;
}

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

const TeamForm: React.FC<TeamFormProps> = ({ team, onSave }) => {
    const [formData, setFormData] = useState<Team>({
        name: team?.name || "",
        about: team?.about || "",
        aboutDetailed: team?.aboutDetailed || "",
        schedule: team?.schedule || "",
        roles: team?.roles || { tank: 0, healer: 0, dps: 0 },
        progress: team?.progress || "",
        requirements: team?.requirements || "",
        classesAndSpecs: team?.classesAndSpecs || {},
        leaderName: team?.leaderName || "",
        contactInfo: team?.contactInfo || "",
        creatorId: team?.creatorId || "",
        id: team?.id
    });
    const [isAboutExpanded, setIsAboutExpanded] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (name.startsWith("roles.")) {
            const role = name.split(".")[1];
            setFormData(prev => ({
                ...prev,
                roles: { ...prev.roles, [role]: parseInt(value) || 0 }
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleClassSpecChange = (className: string, spec: string | null = null, heroSpec: string | null = null) => {
        setFormData(prev => {
            const updatedClassesAndSpecs = { ...prev.classesAndSpecs };
            
            if (!spec) {
                // Toggling a class
                if (updatedClassesAndSpecs[className]) {
                    delete updatedClassesAndSpecs[className];
                } else {
                    updatedClassesAndSpecs[className] = [];
                }
            } else if (!heroSpec) {
                // Toggling a spec
                if (!updatedClassesAndSpecs[className]) {
                    updatedClassesAndSpecs[className] = [];
                }
                const specIndex = updatedClassesAndSpecs[className].indexOf(spec);
                if (specIndex > -1) {
                    updatedClassesAndSpecs[className] = updatedClassesAndSpecs[className].filter(s => !s.startsWith(spec));
                } else {
                    updatedClassesAndSpecs[className].push(spec);
                }
            } else {
                // Toggling a hero spec
                if (!updatedClassesAndSpecs[className]) {
                    updatedClassesAndSpecs[className] = [spec];
                }
                const heroSpecIndex = updatedClassesAndSpecs[className].indexOf(heroSpec);
                if (heroSpecIndex > -1) {
                    updatedClassesAndSpecs[className] = updatedClassesAndSpecs[className].filter(s => s !== heroSpec);
                } else {
                    updatedClassesAndSpecs[className].push(heroSpec);
                }
            }

            return { ...prev, classesAndSpecs: updatedClassesAndSpecs };
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <DialogHeader>
                <DialogTitle>{team ? "Edit Team" : "Create New Team"}</DialogTitle>
                <DialogDescription>
                    {team ? "Update your raid team details below." : "Fill in the details for your new raid team."}
                </DialogDescription>
            </DialogHeader>
            <ScrollArea className="h-[60vh] pr-4">
                <div className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="name">Team Name</Label>
                        <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="about">Brief Description</Label>
                        <Input 
                            id="about" 
                            name="about" 
                            value={formData.about} 
                            onChange={handleChange} 
                            placeholder="Brief description of your team..."
                            required 
                        />
                        <Collapsible open={isAboutExpanded} onOpenChange={setIsAboutExpanded}>
                            <CollapsibleTrigger asChild>
                                <Button variant="outline" size="sm" className="w-full">
                                    {isAboutExpanded ? (
                                        <>
                                            <ChevronUp className="h-4 w-4 mr-2" />
                                            Hide Detailed Description
                                        </>
                                    ) : (
                                        <>
                                            <ChevronDown className="h-4 w-4 mr-2" />
                                            Show Detailed Description
                                        </>
                                    )}
                                </Button>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                                <Textarea 
                                    id="aboutDetailed" 
                                    name="aboutDetailed" 
                                    value={formData.aboutDetailed || ''} 
                                    onChange={handleChange} 
                                    placeholder="Provide more details about your team, goals, and raid atmosphere..."
                                    className="mt-2"
                                    rows={4}
                                />
                            </CollapsibleContent>
                        </Collapsible>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="leaderName">Leader Name</Label>
                        <Input id="leaderName" name="leaderName" value={formData.leaderName} onChange={handleChange} required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="contactInfo">Contact Info</Label>
                        <Input id="contactInfo" name="contactInfo" value={formData.contactInfo} onChange={handleChange} required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="schedule">Schedule</Label>
                        <Input id="schedule" name="schedule" value={formData.schedule} onChange={handleChange} required />
                    </div>
                    <div className="space-y-2">
                        <Label>Roles</Label>
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <Label htmlFor="roles.tank">Tanks</Label>
                                <Input type="number" id="roles.tank" name="roles.tank" value={formData.roles.tank} onChange={handleChange} required min="0" />
                            </div>
                            <div>
                                <Label htmlFor="roles.healer">Healers</Label>
                                <Input type="number" id="roles.healer" name="roles.healer" value={formData.roles.healer} onChange={handleChange} required min="0" />
                            </div>
                            <div>
                                <Label htmlFor="roles.dps">DPS</Label>
                                <Input type="number" id="roles.dps" name="roles.dps" value={formData.roles.dps} onChange={handleChange} required min="0" />
                            </div>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="progress">Progress</Label>
                        <Input id="progress" name="progress" value={formData.progress} onChange={handleChange} required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="requirements">Requirements</Label>
                        <Input id="requirements" name="requirements" value={formData.requirements} onChange={handleChange} />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-lg font-semibold">Classes and Specs Needed</Label>
                        <div className="space-y-4">
                            {Object.entries(classesAndSpecs).map(([className, specs]) => (
                                <div key={className} className="space-y-2">
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`${className}`}
                                            checked={!!formData.classesAndSpecs[className]}
                                            onCheckedChange={() => handleClassSpecChange(className)}
                                        />
                                        <label htmlFor={`${className}`} className="text-sm font-medium">
                                            {className}
                                        </label>
                                    </div>
                                    {formData.classesAndSpecs[className] && (
                                        <div className="ml-6 space-y-2">
                                            {Object.entries(specs).map(([spec, heroSpecs]) => (
                                                <div key={spec} className="space-y-1">
                                                    <div className="flex items-center space-x-2">
                                                        <Checkbox
                                                            id={`${className}-${spec}`}
                                                            checked={formData.classesAndSpecs[className].includes(spec)}
                                                            onCheckedChange={() => handleClassSpecChange(className, spec)}
                                                        />
                                                        <label htmlFor={`${className}-${spec}`} className="text-sm font-medium">
                                                            {spec}
                                                        </label>
                                                    </div>
                                                    {formData.classesAndSpecs[className].includes(spec) && heroSpecs.length > 0 && (
                                                        <div className="ml-6 space-y-1">
                                                            {heroSpecs.map(heroSpec => (
                                                                <div key={heroSpec} className="flex items-center space-x-2">
                                                                    <Checkbox
                                                                        id={`${className}-${spec}-${heroSpec}`}
                                                                        checked={formData.classesAndSpecs[className].includes(heroSpec)}
                                                                        onCheckedChange={() => handleClassSpecChange(className, spec, heroSpec)}
                                                                    />
                                                                    <label htmlFor={`${className}-${spec}-${heroSpec}`} className="text-sm font-medium">
                                                                        {heroSpec}
                                                                    </label>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </ScrollArea>
            <DialogFooter>
                <Button type="submit">Save Team</Button>
            </DialogFooter>
        </form>
    );
};

export default TeamForm;