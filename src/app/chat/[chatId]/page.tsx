import { MainPage } from '@/components/mainPage';

const Page = ({ params }: { params: { chatId: string } }) => {
  return <MainPage id={params.chatId} />;
};

export default Page;
