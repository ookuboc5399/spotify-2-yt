import type { NextPage } from 'next'
import { getSession, useSession } from "next-auth/react";
import Center from "../components/Center";
import Player from "../components/Player";
import Sidebar from "../components/Sidebar";

const Home: NextPage = () => {
  const { data: session, status } = useSession();
  
  return (
    <div className="bg-black h-screen overflow-hidden">
      <main className="overflow-hidden scrollbar-hide flex">
        <Sidebar />
        <Center />
      </main>

      <div className="sticky bottom-0">
        <Player />
      </div>
    </div>
  )
}

export default Home

export async function getServerSideProps(context) {
  const session = await getSession(context);
  return {
    props: { session },
  };
}