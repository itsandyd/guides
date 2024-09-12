import { useToast } from "@/hooks/use-toast";
import { Application } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";
import { Button } from "../ui/Button";

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
