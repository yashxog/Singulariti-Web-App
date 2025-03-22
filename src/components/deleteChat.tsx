import React, { useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Trash } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Chat } from '@/app/library/page';
import axios from 'axios';

interface DeleteChatProps {
  chatId: string;
  chats: Chat[];
  setChats: (chats: Chat[]) => void;
}

export const DeleteChat: React.FC<DeleteChatProps> = ({ chatId, chats, setChats }) => {
  const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const response = await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/chats/${chatId}`, {
        headers: {
            'Content-Type': 'application/json',
          },
    
      });

      if (response.status !== 200) {
        throw new Error('Failed to delete chat');
      }
      // Only update the local state if the delete was successful
      setChats(chats.filter((chat) => chat.id !== chatId));
      toast.success('Chat deleted successfully');
    } catch (error) {
      console.error('Error deleting chat:', error);
      toast.error('Failed to delete chat');
    } finally {
      setLoading(false);
      setConfirmationDialogOpen(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setConfirmationDialogOpen(true)}
        className="bg-paper px-4 text-red-400 rounded-lg hover:scale-105 transition duration-200"
        aria-label="Delete chat"
      >
        <div className='flex flex-row justify-between items-center space-x-2'>
          <Trash size={17} />
          <span>Delete</span>
        </div> 
      </button>
      <Transition appear show={confirmationDialogOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => {
            if (!loading) {
              setConfirmationDialogOpen(false);
            }
          }}
        >
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

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-paper-2 dark:bg-paper-2 border border-white border-opacity-30 p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-charcoal dark:text-charcoal"
                  >
                    Delete Confirmation
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-subtext dark:text-subtext">
                      Are you sure you want to delete this chat?
                    </p>
                  </div>

                  <div className="mt-4 flex justify-end space-x-4">
                    <button
                      type="button"
                      className="text-sm text-subtext dark:text-subtext hover:text-mudbrown dark:hover:text-mudbrown"
                      onClick={() => setConfirmationDialogOpen(false)}
                      disabled={loading}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="text-sm text-red-500 hover:text-red-800 dark:text-red-500 dark:hover:text-red-800"
                      onClick={handleDelete}
                      disabled={loading}
                    >
                      {loading ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};