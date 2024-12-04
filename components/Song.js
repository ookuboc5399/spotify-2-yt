import useSpotify from "../hooks/useSpotify";
import { millisToMinutesAndSeconds } from "../lib/time";
import { currentTrackIdState, isPlayingState } from "../atoms/songAtom";
import { useRecoilState } from "recoil";

function Song({ track, order }) {
  const spotifyApi = useSpotify();
  const [currentTrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);

  const playSong = async () => {
    try {
      const playbackState = await spotifyApi.getMyCurrentPlaybackState();

      if (!playbackState?.body?.device) {
        // アクティブなデバイスがない場合のメッセージ
        alert(
          "Spotifyアプリが起動していること、またはアクティブなデバイスが選択されていることを確認してください。"
        );
        // デバイス一覧を取得して通知
        const devicesResponse = await spotifyApi.getMyDevices();
        const devices = devicesResponse.body.devices;

        if (devices.length === 0) {
          alert(
            "利用可能なデバイスが見つかりません。Spotifyアプリを起動してログインしてください。"
          );
        } else {
          alert(
            `利用可能なデバイスがありますが、選択されていません:\n${devices
              .map((device) => `- ${device.name}`)
              .join("\n")}\n\nSpotifyアプリでデバイスを選択してください。`
          );
        }
        return;
      }

      setCurrentTrackId(track.track.id);
      setIsPlaying(true);

      // 曲の再生
      await spotifyApi.play({
        uris: [track.track.uri],
      });
    } catch (error) {
      console.error("Error playing song:", error);
      if (error.body?.error?.reason === "NO_ACTIVE_DEVICE") {
        alert(
          "再生するにはアクティブなSpotifyデバイスが必要です。Spotifyアプリが実行中であることを確認してください。"
        );
      } else {
        alert("曲を再生できませんでした。エラーの詳細を確認してください。");
      }
    }
  };

  return (
    <div
      className="grid grid-cols-2 py-4 px-5 text-gray-500 rounded-lg hover:bg-gray-900 cursor-pointer text-sm md:text-base"
      onClick={playSong}
    >
      <div className="flex items-center space-x-4">
        <p>{order + 1}</p>
        <img
          className="h-10 w-10"
          src={track.track.album.images[0].url}
          alt=""
        />
        <div>
          <p className="w-36 lg:w-64 text-white truncate">{track.track.name}</p>
          <p className="w-40">{track.track.artists[0].name}</p>
        </div>
      </div>

      <div className="flex items-center justify-between ml-auto md:ml-0">
        <p className="w-40 hidden md:inline-grid">{track.track.album.name}</p>
        <p>{millisToMinutesAndSeconds(track.track.duration_ms)}</p>
      </div>
    </div>
  );
}

export default Song;
