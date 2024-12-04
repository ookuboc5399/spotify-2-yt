import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import {
  HomeIcon,
  MagnifyingGlassIcon,
  BuildingLibraryIcon,
  PlusCircleIcon,
  HeartIcon,
  RssIcon,
} from "@heroicons/react/24/solid";
import useSpotify from "../hooks/useSpotify";
import { useRecoilState } from "recoil";
import { playlistIdState } from "../atoms/playlistAtom";

function Sidebar() {
  const spotifyApi = useSpotify();
  const { data: session } = useSession();
  const [playlists, setPlaylists] = useState([]);
  const [playlistId, setPlaylistId] = useRecoilState(playlistIdState);

  // Fetch user playlists when Spotify API is ready and user is authenticated
  useEffect(() => {
    if (spotifyApi && spotifyApi.getAccessToken()) {
      spotifyApi
        .getUserPlaylists()
        .then((data) => {
          setPlaylists(data.body.items);
        })
        .catch((err) => {
          console.error("Error fetching playlists:", err);
        });
    }
  }, [spotifyApi, session]);

  return (
    <div className="text-gray-500 p-5 text-xs lg:text-sm overflow-y-scroll sm:max-w-[12rem] lg:max-w-[15rem] h-screen scrollbar-hide hidden md:inline-flex border-r border-gray-900 pb-36">
      <div className="space-y-4">
        {/* Sidebar navigation buttons */}
        <button className="flex items-center space-x-2 hover:text-white">
          <HomeIcon className="h-5 w-5" />
          <p>Home</p>
        </button>
        <button className="flex items-center space-x-2 hover:text-white">
          <MagnifyingGlassIcon className="h-5 w-5" />
          <p>Search</p>
        </button>
        <button className="flex items-center space-x-2 hover:text-white">
          <BuildingLibraryIcon className="h-5 w-5" />
          <p>Your Library</p>
        </button>
        <hr className="border-t-[0.1px] border-gray-900" />

        {/* Additional buttons */}
        <button className="flex items-center space-x-2 hover:text-white">
          <PlusCircleIcon className="h-5 w-5 text-gray-400" />
          <p>Create Playlist</p>
        </button>

        <button className="flex items-center space-x-2 hover:text-white">
          <HeartIcon className="h-5 w-5 text-blue-700" />
          <p>Liked Songs</p>
        </button>

        <button className="flex items-center space-x-2 hover:text-white">
          <RssIcon className="h-5 w-5 text-green-700" />
          <p>Your Episodes</p>
        </button>
        <hr className="border-t-[0.1px] border-gray-900" />

        {/* Render playlists */}
        {playlists.length > 0 ? (
          playlists.map((playlist) => (
            <p
              key={playlist.id}
              onClick={() => setPlaylistId(playlist.id)}
              className="cursor-pointer hover:text-white"
            >
              {playlist.name}
            </p>
          ))
        ) : (
          <p className="text-gray-400">No playlists available</p>
        )}
      </div>
    </div>
  );
}

export default Sidebar;
