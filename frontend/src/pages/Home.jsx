import Feed from "@/components/Feed.jsx";
import Sidebar from "../components/Sidebar.jsx";
import Stories from "@/components/Stories.jsx";
import SuggestedUsers from "@/components/SuggestedUsers.jsx";


function Home() {

 
  
  return (
    <div className="bg-linear-to-br from-black via-zinc-900 to-black text-white min-h-screen flex">
      {/* sidebar component */}
      <Sidebar  />

      <main className="flex-1 w-full p-4 mx-auto flex-col gap-6 overflow-auto">
        {/* stories component */}
        <Stories  />

        <div className="flex">
          {/* Feeds Component */}
          <Feed  />
          <div className="max-w-80 w-full h-fulllg:block overflow-hidden p-4">
            {/* Suggested User Component */}
            <SuggestedUsers  />
          </div>
        </div>
      </main>
    </div>
  );
}

export default Home;
