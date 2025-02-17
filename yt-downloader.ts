const url = Deno.args[0];

if (!url) {
  console.error("Uso: ./youtube_downloader <URL do YouTube>");
  Deno.exit(1);
}

const ytDlpPath = "./yt-dlp";
const isWindows = Deno.build.os === "windows";
const ytDlpBinary = isWindows ? ytDlpPath + ".exe" : ytDlpPath;

async function isYtDlpAvailable(): Promise<boolean> {
  try {
    const process = new Deno.Command("yt-dlp", { args: ["--version"] });
    await process.output();
    return true;
  } catch {
    return false;
  }
}

async function downloadYtDlp() {
  console.log("Baixando yt-dlp...");
  const url = isWindows
    ? "https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp.exe"
    : "https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp";

  const res = await fetch(url);
  if (!res.ok) throw new Error("Erro ao baixar yt-dlp.");

  const file = await Deno.open(ytDlpBinary, { create: true, write: true });
  await res.body?.pipeTo(file.writable);
  await file.close();

  if (!isWindows) {
    await Deno.chmod(ytDlpBinary, 0o755);
  }
}

const ytDlpAvailable = await isYtDlpAvailable();
if (!ytDlpAvailable) {
  await downloadYtDlp();
}

const process = new Deno.Command(ytDlpAvailable ? "yt-dlp" : ytDlpBinary, {
  args: ["-f", "bestvideo[ext=mp4]+bestaudio[ext=m4a]/mp4", "-o", "%(title)s.%(ext)s", url],
  stdout: "inherit",
  stderr: "inherit",
});

const { code } = await process.output();
if (code === 0) {
  console.log("Download concluído!");
} else {
  console.error("Erro ao baixar o vídeo.");
}
