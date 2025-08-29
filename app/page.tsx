import Image from "next/image";

export default function Home() {
  return (
    <main className="flex flex-col items-center gap-4 p-8">
      <h1 className="text-2xl font-bold">LINE Dictionary Bot</h1>
      <p>
        Send an English word to the LINE bot to receive noun and verb
        definitions.
      </p>
      <h1 className="text-2xl font-bold">Add LINE Bot</h1>
      <p>Scan the QR code below to add the bot on LINE.</p>
      <div className="flex h-52 w-52 items-center justify-center rounded border border-dashed text-center text-sm text-gray-500">
        <Image
          src="https://qr-official.line.me/sid/L/269hszdp.png"
          alt="QR Code"
          width={256}
          height={256}
        />
      </div>
    </main>
  );
}
