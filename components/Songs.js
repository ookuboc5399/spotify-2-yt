import { useRecoilValue } from "recoil";
import { playlistState } from "../atoms/playlistAtom";
import Song from "./Song";

function Songs() {
  const playlist = useRecoilValue(playlistState);

  if (!playlist || !playlist.tracks?.items) {
    return (
      <div className="px-8 text-gray-500">
        <p>No songs found in this playlist. Select a playlist to view its tracks.</p>
      </div>
    );
  }

  return (
    <div className="px-8 flex flex-col space-y-1 pb-28">
      {playlist.tracks.items.map((track, i) => (
        <Song key={track.track.id || `track-${i}`} track={track} order={i} />
      ))}
    </div>
  );
}

export default Songs;
