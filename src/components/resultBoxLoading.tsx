export const ResultBoxLoading = () => {
    return (
      <div className="flex flex-col space-y-3 w-full max-w-[60%] lg:w-9/12 bg-black dark:bg-black animate-pulse rounded-lg p-3">
        <div className="h-2 rounded-full w-full bg-borderColour1 bg-opacity-30  dark:bg-custom-bg-1" />
        <div className="h-2 rounded-full w-9/12 bg-borderColour1 bg-opacity-30 dark:bg-custom-bg-1" />
        <div className="h-2 rounded-full w-10/12 bg-borderColour1 bg-opacity-30 dark:bg-custom-bg-1" />
      </div>
    );
  };