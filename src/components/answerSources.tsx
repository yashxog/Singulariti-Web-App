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
          className="bg-paper-2 hover:bg-card-hover-1 dark:bg-paper-2 dark:hover:bg-card-hover-1 border border-white dark:border dark:border-white bg-opacity-10 transition duration-200 rounded-lg p-3 flex flex-col space-y-2 font-medium"
          key={i}
          href={source.metadata.url}
          target="_blank"
        >
          <p className="text-charcoal dark:text-charcoal text-xs overflow-hidden whitespace-nowrap text-ellipsis">
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
              <p className="text-xs text-subtext dark:text-subtext overflow-hidden whitespace-nowrap text-ellipsis">
                {source.metadata.url.replace(/.+\/\/|www.|\..+/g, '')}
              </p>
            </div>
            <div className="flex flex-row items-center space-x-1 text-subtext dark:text-subtext text-xs">
              <div className="bg-subtext dark:bg-subtext h-[4px] w-[4px] rounded-full" />
              <span>{i + 1}</span>
            </div>
          </div>
        </a>
      ))}
      {sources.length > 3 && (
        <button
          onClick={openModal}
          className="bg-paper-2 hover:bg-card-hover-1 dark:bg-paper-2 dark:hover:bg-card-hover-1 bg-opacity-30 border border-white transition duration-200 rounded-lg p-3 flex flex-col space-y-2 font-medium"
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
          <p className="text-xs text-subtext dark:text-subtext">
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
            <div className="fixed inset-0 bg-paper bg-opacity-25 backdrop-blur-sm" />
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
                <Dialog.Panel className="w-full h-full transform bg-paper-2 dark:bg-paper-2 border-l border-charcoal dark:border-charcoal p-6 text-left align-middle shadow-xl transition-all overflow-y-auto scrollbar-hide">
                  <Dialog.Title className="text-3xl font-medium leading-6 text-charcoal dark:text-charcoal mb-4">
                    <div className='flex flex-row items-center space-x-2 gap-3 mb-10'>
                        <Link className="text-charcoal" size={24} />
                        Sources
                    </div>
                  </Dialog.Title>
                  <div className="flex flex-col space-y-4">
                    {sources.map((source, i) => (
                      <a
                        className="h-28 bg-paper-2 hover:bg-card-hover-1 dark:bg-paper-2 dark:hover:bg-card-hover-1 bg-opacity-30 border border-white border-opacity-30 dark:border-white dark:border-white transition duration-200 rounded-lg p-3 flex flex-col space-y-2 font-medium"
                        key={i}
                        href={source.metadata.url}
                        target="_blank"
                      >
                        <p className="text-charcoal dark:text-charcoal text-sm overflow-hidden whitespace-nowrap text-ellipsis">
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
                            <p className="text-xs text-subtext dark:text-subtext overflow-hidden whitespace-nowrap text-ellipsis">
                              {source.metadata.url.replace(
                                /^(?:https?:\/\/)?(?:www\.)?(?:\w+\.)?(\w+)\..+$/,
                                '$1'
                              )}
                            </p>
                          </div>
                          <div className="flex flex-row items-center space-x-1 text-subtext dark:text-subtext text-xs">
                            <div className="bg-subtext dark:bg-subtext h-[4px] w-[4px] rounded-full" />
                            <span>{i + 1}</span>
                          </div>
                        </div>
                        <p className="text-subtext dark:text-subtext text-xs font-normal overflow-hidden whitespace-nowrap text-ellipsis">
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
