// import GameCard from "@/components/game/GameCard";
// import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// export default function Home() {
//   const queryClient = new QueryClient()
//   const featuredGames = [
//     { id: 1, title: "Game 1", image: "/images/game1.jpg" },
//     { id: 2, title: "Game 2", image: "/images/game2.jpg" },
//   ];
import { useState } from 'react';
import { useRouter } from 'next/router';

export default function NewGamePage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [category, setCategory] = useState('');
  const [gameFile, setGameFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64File = reader.result?.toString().split(',')[1];

      const response = await fetch('/api/games', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
          thumbnail,
          category,
          gameFile: base64File,
        }),
      });

      if (response.ok) {
        router.push('/games');
      } else {
        alert('Failed to create game');
      }
      setIsLoading(false);
    };

    if (gameFile) {
      reader.readAsDataURL(gameFile);
    }
  };

//   return (
    
//     <div>
//       <h1>Welcome to Game Zone!</h1>
//       <div className="games-grid">
//         {featuredGames.map((game) => (
//           <GameCard key={game.id} game={game} />
//         ))}
//       </div>
//     </div>
//   );
// }

  return (
    <div>
      <h1>Create New Game</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Thumbnail URL</label>
          <input
            type="text"
            value={thumbnail}
            onChange={(e) => setThumbnail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Category</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Game File (ZIP)</label>
          <input
            type="file"
            accept=".zip"
            onChange={(e) => setGameFile(e.target.files?.[0] || null)}
            required
          />
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Creating...' : 'Create Game'}
        </button>
      </form>
    </div>
  );
}