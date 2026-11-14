import { useEffect, useRef, useState } from 'react';
import './hero-cover-video.css';

const HERO_VIDEO = '/videos/el-gran-valle-sagrado.mp4';
const HERO_POSTER = '/assets/aistudio/IMG_20261012_161823591_HDR_d112481d.jpg';

export function HeroCoverVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const syncPlayback = () => {
      if (motionPreference.matches) {
        video.pause();
        return;
      }

      void video.play().catch(() => setIsPlaying(false));
    };

    syncPlayback();
    motionPreference.addEventListener('change', syncPlayback);

    return () => {
      motionPreference.removeEventListener('change', syncPlayback);
      video.pause();
    };
  }, []);

  const togglePlayback = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      void video.play().catch(() => setIsPlaying(false));
      return;
    }

    video.pause();
  };

  return (
    <>
      <video
        ref={videoRef}
        className="hero-image hero-video"
        src={HERO_VIDEO}
        poster={HERO_POSTER}
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
        tabIndex={-1}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
      <button
        className="hero-video-toggle"
        type="button"
        onClick={togglePlayback}
        aria-label={isPlaying ? 'Pausar vídeo de portada' : 'Reproducir vídeo de portada'}
      >
        {isPlaying ? 'Pausar vídeo' : 'Reproducir vídeo'}
      </button>
    </>
  );
}
