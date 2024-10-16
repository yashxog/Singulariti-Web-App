/* eslint-disable @next/next/no-img-element */
import { PlayCircle, PlusIcon, VideoIcon } from 'lucide-react';
import { useState } from 'react';
import Lightbox, { GenericSlide, VideoSlide } from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import { Message } from './mainPage';

type Video = {
  url: string;
  img_src: string;
  title: string;
  iframe_src: string;
};

declare module 'yet-another-react-lightbox' {
  export interface VideoSlide extends GenericSlide {
    type: 'video-slide';
    src: string;
    iframe_src: string;
  }

  interface SlideTypes {
    'video-slide': VideoSlide;
  }
}

export const VideoResults = ({
  query,
  chat_history,
}: {
  query: string;
  chat_history: Message[];
}) => {
  const [videos, setVideos] = useState<Video[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [slides, setSlides] = useState<VideoSlide[]>([]);

  return (
    <div className="w-full mt-4 pl-4">
      {!loading && videos === null && (
        <button
        onClick={async () => {
            setLoading(true);

            const chatModelProvider = localStorage.getItem('chatModelProvider');
            const chatModel = localStorage.getItem('chatModel');
            
            const res = await fetch(
              `${"http://localhost:8200/singulariti"}/videos`,
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  query: query,
                  chat_history: chat_history,
                  chat_model_provider: chatModelProvider,
                  chat_model: chatModel,
                }),
              },
            );

            const data = await res.json();

            const videos = data.videos;
            setVideos(videos);
            setSlides(
              videos.map((video: Video) => {
                return {
                  type: 'video-slide',
                  iframe_src: video.iframe_src,
                  src: video.img_src,
                };
              }),
            );
            setLoading(false);
          }}
          className="w-full border border-dashed border-borderColour1 dark:border-borderColour1 hover:bg-custom-bg-1 dark:hover:bg-custom-bg-1 active:scale-95 duration-200 transition px-4 py-2 flex flex-row items-center justify-between rounded-lg text-gray-700 dark:text-gray-300 text-sm"
        >
          <div className="flex flex-row items-center space-x-2">
            <VideoIcon size={17} />
            <p>Search videos</p>
          </div>
          <PlusIcon className="text-white" size={17} />
        </button>
      )}
      {loading && (
        <div className="grid grid-cols-2 gap-2">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-custom-bg-2 dark:bg-custom-bg-2 h-24 w-full rounded-lg animate-pulse aspect-video"
            />
          ))}
        </div>
      )}
      {videos !== null && videos.length > 0 && (
        <>
          <div className="grid grid-cols-2 gap-2">
            {videos.length > 4
              ? videos.slice(0, 3).map((video, i) => (
                  <div
                    onClick={() => {
                      setOpen(true);
                      setSlides([
                        slides[i],
                        ...slides.slice(0, i),
                        ...slides.slice(i + 1),
                      ]);
                    }}
                    className="relative transition duration-200 active:scale-95 hover:scale-[1.02] cursor-pointer"
                    key={i}
                  >
                    <img
                      src={video.img_src}
                      alt={video.title}
                      className="relative h-24 w-full aspect-video object-cover rounded-lg"
                    />
                    <div className="absolute bg-white/70 dark:bg-black/70 text-black/70 dark:text-white/70 px-2 py-1 flex flex-row items-center space-x-1 bottom-1 right-1 rounded-md">
                      <PlayCircle size={12} />
                      <p className="text-[10px]">Video</p>
                    </div>
                  </div>
                ))
              : videos.map((video, i) => (
                  <div
                    onClick={() => {
                      setOpen(true);
                      setSlides([
                        slides[i],
                        ...slides.slice(0, i),
                        ...slides.slice(i + 1),
                      ]);
                    }}
                    className="relative transition duration-200 active:scale-95 hover:scale-[1.02] cursor-pointer"
                    key={i}
                  >
                    <img
                      src={video.img_src}
                      alt={video.title}
                      className="relative h-24 w-full aspect-video object-cover rounded-lg"
                    />
                    <div className="absolute bg-white/70 dark:bg-black/70 text-black/70 dark:text-white/70 px-2 py-1 flex flex-row items-center space-x-1 bottom-1 right-1 rounded-md">
                      <PlayCircle size={12} />
                      <p className="text-[10px]">Video</p>
                    </div>
                  </div>
                ))}
            {videos.length > 4 && (
              <button
                onClick={() => setOpen(true)}
                className="bg-custom-bg-1 hover:bg-custom-bg-2 dark:bg-custom-bg-1 dark:hover:bg-custom-bg-2 transition duration-200 active:scale-95 hover:scale-[1.02] h-24 w-full rounded-lg flex flex-col justify-between text-gray-700 dark:text-gray-300 p-2"
              >
                <div className="flex flex-row items-center space-x-1">
                  {videos.slice(3, 6).map((video, i) => (
                    <img
                      key={i}
                      src={video.img_src}
                      alt={video.title}
                      className="h-4 w-8 rounded-sm aspect-video object-cover"
                    />
                  ))}
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-xs">
                  View {videos.length - 3} more
                </p>
              </button>
            )}
          </div>
          <Lightbox
            open={open}
            close={() => setOpen(false)}
            slides={slides}
            render={{
              slide: ({ slide }) =>
                slide.type === 'video-slide' ? (
                  <div className="h-full w-full flex flex-row items-center justify-center">
                    <iframe
                      src={slide.iframe_src}
                      className="aspect-video max-h-[95vh] w-[95vw] rounded-2xl md:w-[80vw]"
                      allowFullScreen
                      allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                    />
                  </div>
                ) : null,
            }}
          />
        </>
      )}
    </div>
  );
};
