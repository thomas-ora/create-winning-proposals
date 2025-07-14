import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const ProposalSkeleton = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      {/* Header Skeleton */}
      <div className="bg-card/50 backdrop-blur border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <Skeleton className="w-10 h-10 rounded-lg" />
              <div>
                <Skeleton className="h-8 w-64 mb-2" />
                <Skeleton className="h-5 w-32" />
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Skeleton className="h-9 w-32" />
              <Skeleton className="h-9 w-36" />
            </div>
          </div>
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Meta Cards Skeleton */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="p-4 bg-card/50 backdrop-blur shadow-card">
                <div className="flex items-center space-x-3">
                  <Skeleton className="w-5 h-5 rounded" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-20 mb-2" />
                    <Skeleton className="h-6 w-24" />
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Section Skeletons */}
          <div className="space-y-6">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="p-8 bg-card/50 backdrop-blur shadow-card">
                <Skeleton className="h-8 w-48 mb-4" />
                <div className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  {i === 1 && (
                    <div className="space-y-2 mt-4">
                      {[...Array(4)].map((_, j) => (
                        <div key={j} className="flex items-center space-x-3">
                          <Skeleton className="w-2 h-2 rounded-full" />
                          <Skeleton className="h-4 w-full" />
                        </div>
                      ))}
                    </div>
                  )}
                  {i === 3 && (
                    <div className="mt-4">
                      <div className="grid grid-cols-4 gap-4 mb-2">
                        {[...Array(4)].map((_, j) => (
                          <Skeleton key={j} className="h-8 w-full" />
                        ))}
                      </div>
                      {[...Array(3)].map((_, j) => (
                        <div key={j} className="grid grid-cols-4 gap-4 mb-2">
                          {[...Array(4)].map((_, k) => (
                            <Skeleton key={k} className="h-6 w-full" />
                          ))}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>

          {/* CTA Skeleton */}
          <Card className="p-8 mt-8 shadow-elegant">
            <div className="text-center">
              <Skeleton className="h-8 w-64 mx-auto mb-4" />
              <Skeleton className="h-5 w-96 mx-auto mb-6" />
              <Skeleton className="h-11 w-36 mx-auto" />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};