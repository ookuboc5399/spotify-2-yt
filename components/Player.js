import {
  HeartIcon,
  ForwardIcon,
  PauseIcon,
  ArrowUturnLeftIcon,
  PlayIcon,
  BackwardIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
  ArrowsRightLeftIcon,
} from "@heroicons/react/24/solid";
import { debounce } from "lodash";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { currentTrackIdState, isPlayingState } from "../atoms/songAtom";
import useSongInfo from "../hooks/useSongInfo";
import useSpotify from "../hooks/useSpotify";

function Player() {
  const spotifyApi = useSpotify();
  const { data: session, status } = useSession();
  const [currentTrackId, setCurrentIdTrack] =
    useRecoilState(currentTrackIdState);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
  const [volume, setVolume] = useState(50);

  const songInfo = useSongInfo();

  // console.log(songInfo);

  const fetchCurrentSong = () => {
    if (!songInfo) {
      spotifyApi.getMyCurrentPlayingTrack().then((data) => {
        console.log("Now playing: ", data.body?.item);
        setCurrentIdTrack(data.body?.item?.id);

        spotifyApi
          .getMyCurrentPlaybackState()
          .then((data) => setIsPlaying(data.body?.is_playing))
          .catch(() => {});
      });
    }
  };

  // Fetch the song on first load before any song has been loaded...
  useEffect(() => {
    if (spotifyApi && spotifyApi.getAccessToken() && !currentTrackId) {
      fetchCurrentSong();
      setVolume(50);
    }
  }, [currentTrackId, spotifyApi, session]);

  const handlePlayPause = () => {
    spotifyApi.getMyCurrentPlaybackState().then((data) => {
      if (data.body.is_playing) {
        spotifyApi.pause();
        setIsPlaying(false);
      } else {
        spotifyApi.play();
        setIsPlaying(true);
      }
    });
  };

  useEffect(() => {
    if (volume > 0 && volume < 100) {
      debouncedAdjustVolume(volume);
    }
  }, [volume]);

  const debouncedAdjustVolume = useCallback(
    debounce((volume) => {
      spotifyApi && spotifyApi.setVolume(volume);
    }, 500),
    []
  );

  return (
    <div className="h-24 bg-gradient-to-b from-black to-gray-900 border-gray-900 text-white grid grid-cols-3 text-xs md:text-base px-2 md:px-8">
      <div className="flex items-center space-x-4">
        <img
          className="hidden md:inline h-10 w-10"
          src={songInfo?.album.images?.[0]?.url}
          alt=""
        />
        <div>
          <h3>{songInfo?.name}</h3>
          <p>{songInfo?.artists?.[0]?.name}</p>
        </div>
        <HeartIcon className="hidden md:inline h-5 w-5" />
      </div>

      <div className="flex items-center justify-evenly">
        <ArrowsRightLeftIcon className="w-5 h-5 cursor-pointer hover:scale-125 transition transform duration-100 ease-out" />
        <BackwardIcon
          // onClick={() => spotifyApi.skipToPrevious()} -- The API is not working
          className="w-5 h-5 cursor-pointer hover:scale-125 transition "
        />
        {isPlaying ? (
          <PauseIcon className="cursor-pointer hover:scale-125 transition transform duration-100 ease-out w-10 h-10" onClick={handlePlayPause} />
        ) : (
          <PlayIcon onClick={handlePlayPause} className="cursor-pointer hover:scale-125 transition transform duration-100 ease-out w-10 h-10" />
        )}
        <ForwardIcon
          // onClick={() => spotifyApi.skipToNext()} -- The API is not working
          className="w-5 h-5 cursor-pointer hover:scale-125 transition transform duration-100 ease-out"
        />
        <ArrowUturnLeftIcon className="w-5 h-5 cursor-pointer hover:scale-125 transition transform duration-100 ease-out" />
      </div>

      <div className="flex items-center space-x-3 md:space-x-4 justify-end pr-5">
        <SpeakerXMarkIcon
          onClick={() => volume > 0 && setVolume(volume - 10)}
          className="w-5 h-5 cursor-pointer hover:scale-125 transition transform duration-100 ease-out"
        />
        <input
          type="range"
          className="w-14 md:w-28"
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          min={0}
          max={100}
        />

        <SpeakerWaveIcon
          onClick={() => volume < 100 && setVolume(volume + 10)}
          className="w-5 h-5 cursor-pointer hover:scale-125 transition transform duration-100 ease-out"
        />
      </div>
    </div>
  );
}

export default Player;
