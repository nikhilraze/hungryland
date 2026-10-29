export default function DishCardSkeleton() {
  return (
    <div
      className="surface overflow-hidden rounded-4xl text-char-400"
      aria-hidden="true"
    >
      <div className="aspect-4/3 w-full skeleton bg-char-200 dark:bg-char-800" />
      <div className="flex flex-col gap-3 p-5">
        <div className="h-4 w-3/5 rounded-full skeleton bg-char-200 dark:bg-char-800" />
        <div className="h-3 w-full rounded-full skeleton bg-char-200 dark:bg-char-800" />
        <div className="h-3 w-4/5 rounded-full skeleton bg-char-200 dark:bg-char-800" />
        <div className="mt-3 flex items-end justify-between">
          <div className="h-6 w-16 rounded-full skeleton bg-char-200 dark:bg-char-800" />
          <div className="h-10 w-20 rounded-full skeleton bg-char-200 dark:bg-char-800" />
        </div>
      </div>
    </div>
  );
}
