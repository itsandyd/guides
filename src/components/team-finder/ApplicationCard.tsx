import { useToast } from "@/hooks/use-toast";
import { Application } from "@prisma/client";
import axios from "axios";
import { Button } from "../ui/Button";
import { Trash2 } from "lucide-react";

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
                    <h4 className="text-lg font-semibold">Team ID: {application.teamId}</h4>
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

export default ApplicationCard;
