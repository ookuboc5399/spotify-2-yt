import { ChevronDownIcon } from "@heroicons/react/24/solid";
import { shuffle } from "lodash";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { playlistIdState, playlistState } from "../atoms/playlistAtom";
import useSpotify from "../hooks/useSpotify";
import Songs from "./Songs";

const colors = [
  "from-indigo-500",
  "from-blue-500",
  "from-green-500",
  "from-red-500",
  "from-yellow-500",
  "from-pink-500",
  "from-purple-500",
];

function Center() {
  const { data: session } = useSession();
  const spotifyApi = useSpotify();
  const [playlistId, setPlaylistId] = useRecoilState(playlistIdState);
  const [playlist, setPlaylist] = useRecoilState(playlistState);
  const [color, setColor] = useState(null);

  // Randomly set the background color when the playlist changes
  useEffect(() => {
    setColor(shuffle(colors).pop());
  }, [playlist]);

  // Fetch playlist data when playlistId changes
  useEffect(() => {
    if (!spotifyApi || !playlistId) {
      console.error("Spotify API instance or playlist ID is missing");
      return;
    }

    spotifyApi
      .getPlaylist(playlistId)
      .then((data) => {
        console.log("Playlist data fetched successfully:", data.body);
        setPlaylist(data.body);
      })
      .catch((err) => {
        console.error("Error fetching playlist data:", err);
      });
  }, [spotifyApi, playlistId]);

  return (
    <div className="bg-black flex-grow col-span-full relative h-screen overflow-y-scroll scrollbar-hide">
      <header className="absolute top-5 right-8">
        <div
          onClick={signOut}
          className="flex items-center bg-black space-x-3 text-white opacity-90 rounded-full p-1 pr-2 hover:opacity-80 cursor-pointer"
        >
          <img
            className="rounded-full w-10 h-10"
            src={session?.user.image || "/default-avatar.png"} // Add a default image if session image is missing
            alt="User Avatar"
          />
          <h2>{session?.user.name || "User"}</h2>
          <ChevronDownIcon className="h-5 w-5" />
        </div>
      </header>

      <section
        className={`flex items-end space-x-7 bg-gradient-to-b ${color} to-black h-80 text-white p-8`}
      >
        <img
          src={playlist?.images?.[0]?.url || "/default-playlist.png"} // Add a default image if playlist image is missing
          className="h-44 w-44 shadow-2xl"
          alt="Playlist Cover"
        />
        <div>
          <p>PLAYLIST</p>
          <h1 className="text-2xl md:text-3xl xl:text-5xl font-bold">
            {playlist?.name || "No Playlist Selected"}
          </h1>
        </div>
      </section>

      <div>
        <Songs />
      </div>
    </div>
  );
}

export default Center;
