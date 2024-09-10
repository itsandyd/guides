"use client"

import React, { useState, useEffect } from 'react';
import { Search, Filter, Users, Calendar, Plus, Edit, Trash2, Eye } from 'lucide-react';
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/Dialog';
import axios from 'axios';
import { Label } from '@/components/ui/Label';
import { useCustomToasts } from '@/hooks/use-custom-toasts';
import { useSession } from 'next-auth/react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/Textarea";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';

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

const RaidTeamFinder: React.FC = () => {
    const { theme } = useTheme();
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [filterProgress, setFilterProgress] = useState<string>("all");
    const [teams, setTeams] = useState<Team[]>([]);
    const [editingTeam, setEditingTeam] = useState<Team | undefined>(undefined);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const { loginToast } = useCustomToasts();
    const { data: session } = useSession();
    const [applyingToTeam, setApplyingToTeam] = useState<Team | null>(null);
    const { toast } = useToast();
    const [userApplications, setUserApplications] = useState<Application[]>([]);
    const router = useRouter();
    const [reviewingApplications, setReviewingApplications] = useState<string | null>(null);

    useEffect(() => {
        const fetchTeams = async () => {
            const response = await axios.get('/api/raid-teams');
            setTeams(response.data);
        };
        fetchTeams();

        const fetchUserApplications = async () => {
            if (session?.user?.id) {
                try {
                    const response = await axios.get(`/api/raid-teams/applications?userId=${session.user.id}`);
                    setUserApplications(response.data);
                } catch (error) {
                    console.error('Error fetching user applications:', error);
                }
            }
        };
        fetchUserApplications();
    }, [session]);

    const filteredTeams = teams.filter(team =>
        team.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (filterProgress === "all" || team.progress.includes(filterProgress))
    );

    const handleSaveTeam = async (team: Team) => {
        if (!session?.user) {
            loginToast();
            return;
        }

        try {
            if (team.id) {
                const response = await axios.put(`/api/raid-teams/${team.id}`, team);
                setTeams(teams.map(t => t.id === team.id ? response.data : t));
            } else {
                const response = await axios.post('/api/raid-teams', team);
                setTeams([...teams, response.data]);
            }
            setEditingTeam(undefined);
            setIsDialogOpen(false);
        } catch (error) {
            console.error('Error saving team:', error);
            // You might want to show an error toast here
        }
    };

    const handleDeleteTeam = async (teamId: string) => {
        if (!session?.user) {
            loginToast();
            return;
        }

        try {
            await axios.delete(`/api/raid-teams/${teamId}`);
            setTeams(prevTeams => prevTeams.filter(t => t.id !== teamId));
            toast({
                title: "Team Deleted",
                description: "The raid team has been successfully deleted.",
                variant: "default",
            });
        } catch (error) {
            console.error('Error deleting team:', error);
            toast({
                title: "Error",
                description: "There was an error deleting the team. Please try again.",
                variant: "destructive",
            });
        }
    };

    const handleApplyToTeam = async (application: TeamApplication) => {
        if (!session?.user) {
            loginToast();
            return;
        }

        try {
            const response = await axios.post('/api/raid-teams/applications', application);
            setUserApplications(prevApplications => [...prevApplications, response.data]);
            toast({
                title: "Application Submitted",
                description: "Your application has been sent to the team leader.",
            });
            setApplyingToTeam(null);
        } catch (error) {
            console.error('Error submitting application:', error);
            toast({
                title: "Error",
                description: "There was an error submitting your application. Please try again.",
                variant: "destructive",
            });
        }
    };

    const handleDeleteApplication = async (id: string) => {
        try {
            const response = await axios.delete(`/api/raid-teams/applications/${id}`);
            if (response.status === 200) {
                setUserApplications(prevApplications => 
                    prevApplications.filter(app => app.id !== id)
                );
                toast({
                    title: "Application Deleted",
                    description: "Your application has been successfully deleted.",
                    variant: "default",
                });
            } else {
                throw new Error('Failed to delete application');
            }
        } catch (error) {
            console.error('Error deleting application:', error);
            toast({
                title: "Error",
                description: "There was an error deleting your application. Please try again.",
                variant: "destructive",
            });
        }
    };

    return (
        <div className={`p-8 md:p-12 lg:p-16 transition-colors duration-200 ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
            <h2 className="text-3xl font-bold mb-8">Group Finder</h2>
            <div className="flex flex-col md:flex-row mb-6 space-y-4 md:space-y-0 md:space-x-4">
                <div className="flex-grow">
                    <Input
                        type="text"
                        placeholder="Search teams..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full"
                    />
                </div>
                <div className="flex space-x-4">
                    <Select value={filterProgress} onValueChange={setFilterProgress}>
                        <SelectTrigger className="w-40">
                            <span>{filterProgress === "all" ? "All Progress" : filterProgress}</span>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Progress</SelectItem>
                            <SelectItem value="Normal">Normal</SelectItem>
                            <SelectItem value="Heroic">Heroic</SelectItem>
                            <SelectItem value="Mythic">Mythic</SelectItem>
                        </SelectContent>
                    </Select>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button onClick={() => setEditingTeam(undefined)}>
                                <Plus className="h-4 w-4 mr-2" /> Create Team
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <TeamForm team={editingTeam} onSave={handleSaveTeam} />
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
            <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4">Your Applications</h3>
                {userApplications.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {userApplications.map((application) => (
                            <ApplicationCard 
                                key={application.id} 
                                application={application} 
                                onDelete={handleDeleteApplication}
                            />
                        ))}
                    </div>
                ) : (
                    <p>You haven't applied to any teams yet.</p>
                )}
            </div>
            <h3 className="text-xl font-semibold mb-4">Available Teams</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTeams.map(team => (
                    <div key={team.id} className="bg-white p-4 rounded shadow">
                        <div className="flex flex-col h-full">
                            <div>
                                <h3 className="text-xl font-semibold">{team.name}</h3>
                                <p className="text-gray-600"><Calendar className="inline h-4 w-4 mr-1" /> {team.schedule}</p>
                                <p className="text-gray-600"><Users className="inline h-4 w-4 mr-1" />
                                    Tanks: {team.roles.tank}, Healers: {team.roles.healer}, DPS: {team.roles.dps}
                                </p>
                                <p className="text-gray-600"><Filter className="inline h-4 w-4 mr-1" /> {team.progress}</p>
                                <p className="text-gray-600">Requirements: {team.requirements}</p>
                            </div>
                            <div className="mt-auto pt-4">
                                {session?.user?.id === team.creatorId ? (
                                    <div className="flex space-x-2">
                                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                            <DialogTrigger asChild>
                                                <Button variant="outline" onClick={() => setEditingTeam(team)}>
                                                    <Edit className="h-4 w-4 mr-2" /> Edit
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <TeamForm team={editingTeam} onSave={handleSaveTeam} />
                                            </DialogContent>
                                        </Dialog>
                                        <Button variant="destructive" onClick={() => handleDeleteTeam(team.id!)}>
                                            Delete
                                        </Button>
                                        {team.id && (
                                            <Dialog open={reviewingApplications === team.id} onOpenChange={(open) => setReviewingApplications(open ? team.id ?? null : null)}>
                                                <DialogTrigger asChild>
                                                    <Button variant="outline">
                                                        <Eye className="h-4 w-4 mr-2" /> View Applications
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent className="max-w-4xl">
                                                    <ApplicationReviewForm teamId={team.id} />
                                                </DialogContent>
                                            </Dialog>
                                        )}
                                    </div>
                                ) : (
                                    <Dialog open={applyingToTeam?.id === team.id} onOpenChange={(open) => !open && setApplyingToTeam(null)}>
                                        <DialogTrigger asChild>
                                            <Button className="w-full" onClick={() => setApplyingToTeam(team)}>Apply to Join</Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <ApplyToTeamForm team={team} onSubmit={handleApplyToTeam} />
                                        </DialogContent>
                                    </Dialog>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

interface TeamFormProps {
    team?: Team;
    onSave: (team: Team) => void;
}

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
                                <Input 
                                    id="aboutDetailed" 
                                    name="aboutDetailed" 
                                    value={formData.aboutDetailed || ''} 
                                    onChange={handleChange} 
                                    placeholder="Provide more details about your team, goals, and raid atmosphere..."
                                    className="mt-2"
                                    // rows={4}
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
                <DialogClose asChild>
                    <Button type="button" variant="destructive">Cancel</Button>
                </DialogClose>
                <Button type="submit">Save Team</Button>
            </DialogFooter>
        </form>
    );
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
                        <Label htmlFor="characterName">Character Name</Label>
                        <Input id="characterName" name="characterName" value={formData.characterName} onChange={handleChange} required />
                    </div>
                    <div>
                        <Label htmlFor="characterClass">Character Class</Label>
                        <Select 
                            name="characterClass" 
                            value={formData.characterClass} 
                            onValueChange={handleClassChange}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select a class" />
                            </SelectTrigger>
                            <SelectContent>
                                <ScrollArea className="h-[200px]">
                                    {(Object.keys(classesAndSpecs) as WoWClass[]).map((className) => (
                                        <SelectItem key={className} value={className}>{className}</SelectItem>
                                    ))}
                                </ScrollArea>
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label htmlFor="characterSpec">Character Spec</Label>
                        <Select 
                            name="characterSpec" 
                            value={formData.characterSpec} 
                            onValueChange={handleSpecChange}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select a spec" />
                            </SelectTrigger>
                            <SelectContent>
                                {Object.keys(classesAndSpecs[formData.characterClass]).map((spec) => (
                                    <SelectItem key={spec} value={spec}>{spec}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label htmlFor="availability">Availability</Label>
                        <Input id="availability" name="availability" value={formData.availability} onChange={handleChange} required />
                    </div>
                    <div>
                        <Label htmlFor="experience">Raiding Experience</Label>
                        <Input 
                            id="experience" 
                            name="experience" 
                            value={formData.experience} 
                            onChange={handleChange} 
                            required 
                            // className="h-20 resize-none"
                        />
                    </div>
                    <div>
                        <Label htmlFor="additionalInfo">Additional Information</Label>
                        <Input 
                            id="additionalInfo" 
                            name="additionalInfo" 
                            value={formData.additionalInfo} 
                            onChange={handleChange} 
                            // className="h-20 resize-none"
                        />
                    </div>
                </div>
            </ScrollArea>
            <DialogFooter>
                <Button type="submit">Submit Application</Button>
            </DialogFooter>
        </form>
    );
};

interface Application {
    id: string;
    teamId: string;
    applicantId: string;
    characterName: string;
    characterClass: string;
    characterSpec: string;
    experience: string;
    availability: string;
    additionalInfo?: string;
    status: 'PENDING' | 'APPROVED' | 'DECLINED';
    createdAt: string;
    updatedAt: string;
    team?: {
        id: string;
        name: string;
    };
}

const ApplicationCard: React.FC<{ application: Application, onDelete: (id: string) => void }> = ({ application, onDelete }) => {
    const { toast } = useToast();

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this application?')) {
            try {
                await axios.delete(`/api/raid-teams/applications/${application.id}`);
                onDelete(application.id);
                toast({
                    title: "Application Deleted",
                    description: "Your application has been successfully deleted.",
                    variant: "default",
                });
            } catch (error) {
                console.error('Error deleting application:', error);
                toast({
                    title: "Error",
                    description: "There was an error deleting your application. Please try again.",
                    variant: "destructive",
                });
            }
        }
    };

    return (
        <div className="bg-white p-4 rounded shadow">
            <div className="flex justify-between items-start">
                <div>
                    <h4 className="text-lg font-semibold">{application.team?.name || 'Unknown Team'}</h4>
                    <p>Character: {application.characterName} - {application.characterClass} ({application.characterSpec})</p>
                    <p>Status: {application.status}</p>
                    <p>Applied on: {new Date(application.createdAt).toLocaleDateString()}</p>
                </div>
                <Button variant="destructive" size="sm" onClick={handleDelete}>
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
};

interface ApplicationReviewFormProps {
    teamId: string;
}

const ApplicationReviewForm: React.FC<ApplicationReviewFormProps> = ({ teamId }) => {
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const response = await axios.get(`/api/raid-teams/${teamId}/applications`);
                setApplications(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching applications:', error);
                toast({
                    title: "Error",
                    description: "Failed to fetch applications. Please try again.",
                    variant: "destructive",
                });
                setLoading(false);
            }
        };

        fetchApplications();
    }, [teamId]);

    const handleUpdateStatus = async (applicationId: string, newStatus: 'APPROVED' | 'DECLINED' | 'PENDING') => {
        try {
            await axios.patch(`/api/raid-teams/applications/${applicationId}`, { status: newStatus });
            setApplications(apps => apps.map(app => 
                app.id === applicationId ? { ...app, status: newStatus } : app
            ));
            toast({
                title: "Status Updated",
                description: `Application status updated to ${newStatus.toLowerCase()}.`,
            });
        } catch (error) {
            console.error('Error updating application status:', error);
            toast({
                title: "Error",
                description: "Failed to update application status. Please try again.",
                variant: "destructive",
            });
        }
    };

    if (loading) {
        return <div>Loading applications...</div>;
    }

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold">Review Applications</h2>
            {applications.length === 0 ? (
                <p>No applications to review.</p>
            ) : (
                applications.map(app => (
                    <div key={app.id} className="bg-gray-100 p-4 rounded">
                        <h3 className="text-lg font-semibold">{app.characterName} - {app.characterClass} ({app.characterSpec})</h3>
                        <p>Experience: {app.experience}</p>
                        <p>Availability: {app.availability}</p>
                        {app.additionalInfo && <p>Additional Info: {app.additionalInfo}</p>}
                        <p>Status: {app.status}</p>
                        <div className="mt-2 space-x-2">
                            <Button onClick={() => handleUpdateStatus(app.id, 'APPROVED')} disabled={app.status === 'APPROVED'}>Approve</Button>
                            <Button onClick={() => handleUpdateStatus(app.id, 'DECLINED')} disabled={app.status === 'DECLINED'}>Decline</Button>
                            <Button onClick={() => handleUpdateStatus(app.id, 'PENDING')} disabled={app.status === 'PENDING'}>Mark as Pending</Button>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default RaidTeamFinder;