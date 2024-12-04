import { signIn, useSession } from "next-auth/react";
import { useEffect } from "react";
import SpotifyWebApi from "spotify-web-api-node";

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
  clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
  redirectUri: process.env.REDIRECT_URI,
});

function useSpotify() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (session) {
      try {
        if (session.error === "RefreshAccessTokenError") {
          console.warn("RefreshAccessTokenError: Redirecting to sign in.");
          signIn();
        } else if (session.user?.accessToken) {
          spotifyApi.setAccessToken(session.user.accessToken);
          console.log("Access token set for Spotify API");
        } else {
          console.error("No access token available in session.");
        }
      } catch (error) {
        console.error("Error setting access token:", error);
      }
    }
  }, [session]);

  return spotifyApi;
}

export default useSpotify;
