'use client'

import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function NavbarSkeletonLoaderComponent() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-background dark:bg-gray-900">
      <Card className="w-full max-w-2xl bg-gray-800 border-gray-700">
        <CardContent className="p-6">
          <nav className="flex justify-between items-center">
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
    </div>
  )
}