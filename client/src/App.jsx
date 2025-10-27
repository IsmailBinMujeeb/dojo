import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "@/pages/Home";
import Signup from "@/pages/Signup";
import Login from "@/pages/Login";
import Profile from "@/pages/Profile";
import User from "@/pages/User";
import Feeds from "@/pages/Feeds";
import Followers from "@/pages/Followers";
import Following from "@/pages/Following";
import Bookmarks from "@/pages/Bookmarks";
import Explore from "@/pages/Explore";
import Notifications from "@/pages/Notifications";
import Messages from "@/pages/Messages";
import DojoAI from "@/pages/DojoAI";
import Settings from "@/pages/Settings";
import NotFound from "@/pages/NotFound";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/followers/:_id" element={<Followers />} />
          <Route path="/following/:_id" element={<Following />} />
          <Route path="/feeds" element={<Feeds />} />
          <Route path="/bookmarks" element={<Bookmarks />} />
          <Route path="/explore/:searchQuery" element={<Explore />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/dojoai" element={<DojoAI />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/notfound" element={<NotFound />} />
          <Route path="/:username" element={<User />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
