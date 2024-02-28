import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Star } from "lucide-react";
import Link from "next/link";

const page = async () => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const res = await fetch(`${baseUrl}/getMovies`, {
    cache: "no-store",
  });
  const data = await res.json();
  const movies = data?.movies;
  return (
    <div className="px-6 py-4">
      <title>Movies - ReelsGood</title>
      <h1 className="text-2xl mb-4">Movies streaming near you</h1>

      {/* Movie list */}
      <div className="flex flex-wrap gap-10 justify-center lg:justify-start">
        {movies?.map((movie: any, i: any) => (
          <Link href={`movies/${movie.id}`}>
            <div>
              <Card className="flex flex-col border-2 border-[rgba(36,36,36)] rounded-lg overflow-hidden bg-transparent cursor-pointer">
                <div className="relative">
                  <img
                    loading="lazy"
                    className="h-[400px] w-[250px] object-cover hover:scale-110 transition-all duration-200"
                    src={movie?.movie_picture[0]?.picture}
                    alt={movie.name}
                  />
                  <div className="bg-[rgb(0,0,0)] absolute bottom-0 left-0 flex gap-2 w-full p-2">
                    <Star className="h-6 w-6" color="#FFD447" fill="#FFD447" />
                    <span className="">
                      {movie.rating ? movie.rating : 0} / 10
                    </span>
                  </div>
                </div>
              </Card>
              <h1 className="text-xl mt-2">{movie?.name}</h1>
              <div className="flex items-center gap-2">
                <span className="text-sm text-[rgb(106,106,106)] mt-2">
                  {movie?.duration}
                </span>
                <span className="mt-2 text-[rgb(106,106,106)]">•</span>
                <span className="text-sm text-[rgb(106,106,106)] mt-2">
                  {movie?.language}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default page;
