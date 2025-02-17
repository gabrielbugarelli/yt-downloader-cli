## Is a simple youtube downloader video .mp4 CLI

### How to compile

Before clone project, compile with this command:

```
deno compile --allow-run --allow-write --allow-net --output yt-downloader yt-downloader.ts
```

Move the binary for ***/usr/bin/local/*** and execute terminal command:

```
yt-downloader "your-youtube-url"
```