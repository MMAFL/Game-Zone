export default function GameDetail({ params }: { params: { id: string } }) {
  const game = {
    id: params.id,
    title: `Game ${params.id}`,
    description: "This is an amazing game!",
  };

  return (
    <div>
      <h1>{game.title}</h1>
      <p>{game.description}</p>
    </div>
  );
}
