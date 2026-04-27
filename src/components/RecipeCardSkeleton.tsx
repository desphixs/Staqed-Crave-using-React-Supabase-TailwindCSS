const RecipeCardSkeleton = () => {
  return (
    <div className="relative bg-zinc-900/50 border border-zinc-800/50 rounded-[2.5rem] overflow-hidden animate-pulse">
      {/* Image Area Skeleton */}
      <div className="aspect-[4/5] bg-zinc-800" />

      {/* Content Area Skeleton */}
      <div className="p-6 space-y-4">
        {/* Category & Time Row */}
        <div className="flex justify-between items-center">
          <div className="h-4 w-20 bg-zinc-800 rounded-full" />
          <div className="h-4 w-12 bg-zinc-800 rounded-full" />
        </div>

        {/* Title Skeleton */}
        <div className="space-y-2">
          <div className="h-6 w-full bg-zinc-800 rounded-lg" />
          <div className="h-6 w-2/3 bg-zinc-800 rounded-lg" />
        </div>

        {/* Chef & Likes Row */}
        <div className="pt-4 flex justify-between items-center border-t border-zinc-800/50">
          <div className="h-5 w-24 bg-zinc-800 rounded-md" />
          <div className="h-8 w-8 bg-zinc-800 rounded-full" />
        </div>
      </div>
    </div>
  );
};

export default RecipeCardSkeleton;
