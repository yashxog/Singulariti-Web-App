export const ResultBoxLoading = () => {
  return (
    <div className="w-full flex justify-center">
      <div className="flex flex-col space-y-3 w-full max-w-[70%] lg:w-9/12 bg-paper dark:bg-paper animate-pulse rounded-lg p-3">
        <div className="h-2 rounded-full w-full bg-paper-2 bg-opacity-30 dark:bg-paper-2" />
        <div className="h-2 rounded-full w-9/12 bg-paper-2 bg-opacity-30 dark:bg-paper-2" />
        <div className="h-2 rounded-full w-10/12 bg-paper-2 bg-opacity-30 dark:bg-paper-2" />
      </div>
    </div>
  );
};