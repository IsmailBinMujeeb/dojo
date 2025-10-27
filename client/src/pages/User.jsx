import { Protected } from "@/components/Protected";
import PanelWrapper from "@/components/panel-wrapper";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context/authContext";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MapPin, Link2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Spinner } from "@/components/ui/spinner";
import Post from "@/components/Post";
import { useParams, useNavigate } from "react-router-dom";

const Profile = () => {
  const { user } = useContext(AuthContext);
  const { username } = useParams();
  const [posts, setPosts] = useState([]);
  const [isPostsLoading, setIsPostsLoading] = useState(true);
  const [isFollowingLoading, setIsFollowingLoading] = useState(false);
  const [profile, setProfile] = useState({});
  const navigate = useNavigate();
  const [isUserFollowingProfile, setIsUserFollowingProfile] = useState();

  useEffect(() => {
    if (!user?._id) return;

    (async () => {
      try {
        const data = await fetch(
          `http://localhost:3000/api/user/profile/${username}`,
          {
            credentials: "include",
          },
        );
        const json = await data.json();

        if (!json.data) {
          navigate("/notfound");
        }

        if (json.data.isProfileBelongsToAthenticatedUser)
          return navigate("/profile");
        if (json.data.isUserFollowingProfile) setIsUserFollowingProfile(true);

        setProfile(json.data);
      } catch (error) {
        console.error(error);
      }
    })();

    (async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/user/posts/${profile._id}`,
          {
            credentials: "include",
          },
        );
        const json = await response.json();

        setPosts(json.data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsPostsLoading(false);
      }
    })();
  }, [user?._id, profile?._id, navigate, username]);

  async function handleFollow() {
    try {
      setIsFollowingLoading(true);
      await fetch(`http://localhost:3000/api/follower/${profile?._id}`, {
        credentials: "include",
        method: "POST",
      });

      setIsUserFollowingProfile((prev) => !prev);
    } catch (error) {
      console.log(error);
    } finally {
      setIsFollowingLoading(false);
    }
  }

  return (
    <Protected>
      <PanelWrapper>
        <div className="relative w-full h-full">
          <AspectRatio ratio={3 / 1}>
            <img
              src={profile?.coverPhoto}
              alt={profile?.username}
              className="w-full"
            />
          </AspectRatio>
          <Avatar className="size-[135px] absolute top-[135px] left-1/40">
            <AvatarImage src={profile?.avatar} alt={profile?.username} />
            <AvatarFallback>{profile?.username}</AvatarFallback>
          </Avatar>
          <div className="float-right m-4">
            {isUserFollowingProfile ? (
              <Button
                className="cursor-pointer"
                variant={"destructive"}
                onClick={handleFollow}
              >
                {isFollowingLoading ? "Unfollowing..." : "Unfollow"}
              </Button>
            ) : (
              <Button className="cursor-pointer" onClick={handleFollow}>
                {isFollowingLoading ? "Following..." : "Follow"}
              </Button>
            )}
          </div>
          <div className="my-4">
            <div className="m-8 gap-2 flex flex-col">
              <div className="flex flex-col gap">
                <div className="text-2xl font-bold">{profile?.name}</div>
                <div className="text-zinc-500">@{profile?.username}</div>
              </div>
              <div className="font-light">{profile?.bio}</div>
              <div className="flex gap-6 text-zinc-500">
                <div className="flex items-center gap-2">
                  <MapPin className="size-4" /> {profile?.location}
                </div>
                <div className="flex items-center gap-2">
                  <Link2 className="size-4" />{" "}
                  <a href={profile?.website} className="text-blue-400">
                    {profile?.website}
                  </a>
                </div>
              </div>
              <div className="text-zinc-500 flex gap-4 ">
                <Link to={`/followers/${profile?._id}`}>
                  <span className="text-white font-semibold">
                    {profile?.followersCount}
                  </span>{" "}
                  Followers
                </Link>
                <Link to={`/following/${profile?._id}`}>
                  <span className="text-white font-semibold">
                    {profile?.followingCount}
                  </span>{" "}
                  Following
                </Link>
              </div>
            </div>
          </div>
          <div className="border-t border-t-zinc-500">
            {isPostsLoading ? (
              <div className="w-full my-8 flex justify-center items-center">
                <Spinner className="size-8 text-blue-500" />
              </div>
            ) : (
              posts &&
              posts.map((post) => <Post post={post} key={post._id}></Post>)
            )}
          </div>
        </div>
      </PanelWrapper>
    </Protected>
  );
};

export default Profile;
