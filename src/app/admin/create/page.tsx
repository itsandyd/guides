import { InitialForm } from "@/components/admin/initialForm";

export const maxDuration = 60

export default async function CreatePage() {
    return (
        <div className="mt-4 w-full">
            <InitialForm />
        </div>
    )
}