export default function Home() {
  return (
    <main className="flex flex-col items-center gap-4 p-8">
      <h1 className="text-2xl font-bold">LINE Dictionary Bot</h1>
      <p>Send an English word to the LINE bot to receive noun and verb definitions.</p>
      <p>Visit <a href="/qr" className="underline">/qr</a> for the add-friend QR code.</p>
    </main>
  );
}
