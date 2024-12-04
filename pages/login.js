import { useRouter } from "next/router";
import { signIn } from "next-auth/react";

function Login({ providers }) {
  const router = useRouter();
  const callbackUrl = router.query.callbackUrl || "/";

  // プロバイダーが取得されていない場合のフォールバック
  if (!providers || Object.keys(providers).length === 0) {
    return (
      <div className="flex flex-col items-center bg-black min-h-screen w-full justify-center">
        <p className="text-white">No authentication providers available.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center bg-black min-h-screen w-full justify-center">
      <img
        className="w-52 mb-5"
        src="https://links.papareact.com/9xl"
        alt="App Logo"
      />
      {Object.values(providers).map((provider) => (
        <div key={provider.name}>
          <button
            className="p-5 bg-[#18D860] rounded-lg text-white"
            onClick={() => signIn(provider.id, { callbackUrl })}
            aria-label={`Sign in with ${provider.name}`}
          >
            Login with {provider.name}
          </button>
        </div>
      ))}
    </div>
  );
}

export default Login;

// サーバーサイドで認証プロバイダーを取得
export async function getServerSideProps() {
  try {
    const providers = await import("next-auth/react").then((module) =>
      module.getProviders()
    );
    return {
      props: { providers },
    };
  } catch (error) {
    console.error("Failed to fetch providers:", error);
    return {
      props: { providers: null },
    };
  }
}
