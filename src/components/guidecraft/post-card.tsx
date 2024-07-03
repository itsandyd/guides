import Image from "next/image";
import Link from "next/link";

interface PostCardProps {
    id: string;
    title: string;
    content: string;
    createdAt: Date;
    subredditName: string;
}

export const PostCard = ({
    id,
    title,
    content,
    createdAt,
    subredditName,
}: PostCardProps) => {
    return ( 
        <Link href={`/guides/${id}`}>
            <div className="group hover:shadow-sm transition  border rounded-lg p-3 h-full">
                <div className="flex flex-col pt-2">
                    <div className="text-lg md:text-base font-medium">
                        {title}
                    </div>
                    {/* <p className="text-xs text-muted-foreground">
                        {subredditName}
                    </p>
                    <p className="text-sm md:text-sm font-medium text-slate-700">
                        {content}
                    </p> */}
                    {/* <p className="text-xs text-muted-foreground">
                        {createdAt.toLocaleDateString()}
                    </p> */}
                </div>
            </div>
        </Link>
     );
}