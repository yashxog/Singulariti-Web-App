import { Dialog, Transition } from '@headlessui/react';
import { Document } from '@langchain/core/documents';
import { Fragment, useState } from 'react';
import { Link } from 'lucide-react';
import Image from 'next/image';

export const AnswerSources = ({ sources }: { sources: Document[] }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const closeModal = () => {
    setIsDialogOpen(false);
    document.body.classList.remove('overflow-hidden');
  };

  const openModal = () => {
    setIsDialogOpen(true);
    document.body.classList.add('overflow-hidden');
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
      {sources.slice(0, 3).map((source, i) => (
        <a
          className="bg-gray-700 hover:bg-gray-800 dark:bg-custom-bg-2 dark:hover:bg-customBg border border-borderColour1 dark:border dark:border-[linear-gradient(to_right, rgba(112, 11, 151, 1) 0%, rgba(136, 10, 223, 1) 100%)] bg-opacity-10 transition duration-200 rounded-lg p-3 flex flex-col space-y-2 font-medium"
          key={i}
          href={source.metadata.url}
          target="_blank"
        >
          <p className="text-white dark:text-white text-xs overflow-hidden whitespace-nowrap text-ellipsis">
            {source.metadata.title}
          </p>
          <div className="flex flex-row items-center justify-between">
            <div className="flex flex-row items-center space-x-1">
              <Image
                src={`https://s2.googleusercontent.com/s2/favicons?domain_url=${source.metadata.url}`}
                width={16}
                height={16}
                alt="favicon"
                className="rounded-lg h-4 w-4"
              />
              <p className="text-xs text-white/50 dark:text-white/50 overflow-hidden whitespace-nowrap text-ellipsis">
                {source.metadata.url.replace(/.+\/\/|www.|\..+/g, '')}
              </p>
            </div>
            <div className="flex flex-row items-center space-x-1 text-white/50 dark:text-white/50 text-xs">
              <div className="bg-white/50 dark:bg-white/50 h-[4px] w-[4px] rounded-full" />
              <span>{i + 1}</span>
            </div>
          </div>
        </a>
      ))}
      {sources.length > 3 && (
        <button
          onClick={openModal}
          className="bg-gray-700 hover:bg-gray-800 dark:bg-custom-bg-2 dark:hover:bg-dark-200 bg-opacity-30 border border-borderColour1 transition duration-200 rounded-lg p-3 flex flex-col space-y-2 font-medium"
        >
          <div className="flex flex-row items-center space-x-1">
            {sources.slice(3, 6).map((source, i) => (
              <Image
                src={`https://s2.googleusercontent.com/s2/favicons?domain_url=${source.metadata.url}`}
                width={16}
                height={16}
                alt="favicon"
                className="rounded-lg h-4 w-4"
                key={i}
              />
            ))}
          </div>
          <p className="text-xs text-white/50 dark:text-white/50">
            View {sources.length - 3} more
          </p>
        </button>
      )}
      <Transition appear show={isDialogOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-y-0 right-0 overflow-y-auto w-[30%]">
            <div className="flex min-h-full items-center justify-center text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-x-full"
                enterTo="opacity-100 translate-x-0"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-x-0"
                leaveTo="opacity-0 translate-x-full"
              >
                <Dialog.Panel className="w-full h-full transform bg-black dark:bg-black border-l border-borderColour1 dark:border-borderColour1 p-6 text-left align-middle shadow-xl transition-all overflow-y-auto scrollbar-hide">
                  <Dialog.Title className="text-3xl font-medium leading-6 text-white dark:text-white mb-4">
                    <div className='flex flex-row items-center space-x-2 gap-3 mb-10'>
                        <Link className="text-white" size={24} />
                        Sources
                    </div>
                  </Dialog.Title>
                  <div className="flex flex-col space-y-4">
                    {sources.map((source, i) => (
                      <a
                        className="h-28 bg-custom-bg-1 hover:bg-custom-bg-2 dark:bg-custom-bg-1 dark:hover:bg-custom-bg-2 bg-opacity-30 border border-borderColour1 border-opacity-30 dark:border-borderColour1 dark:border-opacity-30 transition duration-200 rounded-lg p-3 flex flex-col space-y-2 font-medium"
                        key={i}
                        href={source.metadata.url}
                        target="_blank"
                      >
                        <p className="text-white dark:text-white text-sm overflow-hidden whitespace-nowrap text-ellipsis">
                          {source.metadata.title}
                        </p>
                        <div className="flex flex-row items-center justify-between">
                          <div className="flex flex-row items-center space-x-2">
                            <Image
                              src={`https://s2.googleusercontent.com/s2/favicons?domain_url=${source.metadata.url}`}
                              width={16}
                              height={16}
                              alt="favicon"
                              className="rounded-lg h-6 w-6"
                            />
                            <p className="text-xs text-white/50 dark:text-white/50 overflow-hidden whitespace-nowrap text-ellipsis">
                              {source.metadata.url.replace(
                                /^(?:https?:\/\/)?(?:www\.)?(?:\w+\.)?(\w+)\..+$/,
                                '$1'
                              )}
                            </p>
                          </div>
                          <div className="flex flex-row items-center space-x-1 text-white/50 dark:text-white/50 text-xs">
                            <div className="bg-white/50 dark:bg-white/50 h-[4px] w-[4px] rounded-full" />
                            <span>{i + 1}</span>
                          </div>
                        </div>
                        <p className="text-white dark:text-white text-xs font-normal overflow-hidden whitespace-nowrap text-ellipsis">
                          {source.pageContent}
                          </p>
                      </a>
                    ))}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};
