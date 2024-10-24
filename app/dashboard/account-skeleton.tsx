import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function AccountSkeleton() {
    return (
        <Card className="w-full bg-gray-800 border-gray-700">
            <CardContent className="px-6 py-4">
                <nav className="flex flex-col gap-4 md:justify-between items-center md:flex-row md:gap-0">
                    <Skeleton className="h-6 w-32 bg-gray-700" />
                    <div className="flex items-center space-x-4">
                        <div className="flex flex-col space-y-1">
                            <Skeleton className="h-4 w-24 bg-gray-700" />
                            <Skeleton className="h-5 w-32 bg-gray-700" />
                        </div>
                        <Skeleton className="h-10 w-32 bg-gray-700" />
                    </div>
                </nav>
            </CardContent>
        </Card>
    );
}
