import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/Dialog';
import axios from 'axios';
import { useCustomToasts } from '@/hooks/use-custom-toasts';
import { useSession } from 'next-auth/react';
import { useToast } from "@/hooks/use-toast";
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { Application, Character } from '@prisma/client';
import { Plus } from 'lucide-react';
import TeamForm from './TeamForm';
import CharacterCard from './CharacterCard';
import ApplicationCard from './ApplicationCard';


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
    const [characters, setCharacters] = useState<Character[]>([]);
    const [isAddingCharacter, setIsAddingCharacter] = useState(false);
    // const [newCharacter, setNewCharacter] = useState<Omit<Character, 'id'>>({
    //     name: '',
    //     class: '',
    //     spec: '',
    // });

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

    const handleSaveTeam = async (team: Team) => {
        try {
            if (team.id) {
                await axios.put(`/api/raid-teams/${team.id}`, team);
                setTeams(teams.map(t => t.id === team.id ? team : t));
            } else {
                const response = await axios.post('/api/raid-teams', team);
                setTeams([...teams, response.data]);
            }
            setIsDialogOpen(false);
            toast({
                title: team.id ? "Team Updated" : "Team Created",
                description: team.id ? "Your team has been successfully updated." : "Your team has been successfully created.",
                variant: "default",
            });
        } catch (error) {
            console.error('Error saving team:', error);
            toast({
                title: "Error",
                description: "There was an error saving your team. Please try again.",
                variant: "destructive",
            });
        }
    };

    const handleDeleteApplication = async (id: string) => {
        setUserApplications(userApplications.filter(app => app.id !== id));
    };

    const filteredTeams = teams.filter(team => 
        team.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (filterProgress === "all" || team.progress === filterProgress)
    );

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-8">Raid Team Finder</h1>
            <div className="flex justify-between items-center mb-4">
                <div className="flex-1 mr-4">
                    <Input
                        type="text"
                        placeholder="Search teams..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
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
            <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4">Your Characters</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {characters.map((character) => (
                        <CharacterCard key={character.id} character={character} />
                    ))}
                    <Button onClick={() => setIsAddingCharacter(true)} className="h-full flex items-center justify-center">
                        <Plus className="mr-2" /> Add Character
                    </Button>
                </div>
            </div>
            <h3 className="text-xl font-semibold mb-4">Available Teams</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* {filteredTeams.map(team => (
                    <TeamCard 
                        key={team.id} 
                        team={team} 
                        onEdit={() => {
                            setEditingTeam(team);
                            setIsDialogOpen(true);
                        }}
                        onApply={() => setApplyingToTeam(team)}
                        onReviewApplications={() => setReviewingApplications(team.id)}
                    />
                ))} */}
            </div>
        </div>
    );
};

export default RaidTeamFinder;