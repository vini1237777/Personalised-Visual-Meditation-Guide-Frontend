#!/usr/bin/env bash
# Makes the 1080p background videos from the 4K sources.
#
#   ./perf/background-video/encode.sh <folder with bg1.mp4 to bg4.mp4>
#
# 1080p is enough behind the page content. The bitrate is capped at 3 Mbps so a
# busy scene cannot grow the file, and +faststart puts the index at the front so
# the browser can show the first frame before the rest of the file arrives.
# Audio is dropped because the videos always play muted.
set -euo pipefail

src="${1:?Pass the folder that holds bg1.mp4 to bg4.mp4}"
out="${2:-$src/1080p}"
mkdir -p "$out"

for n in 1 2 3 4; do
  ffmpeg -v error -y -i "$src/bg$n.mp4" -an \
    -vf "scale=1920:-2" \
    -c:v libx264 -preset slow -crf 26 -maxrate 3M -bufsize 6M \
    -pix_fmt yuv420p -movflags +faststart \
    "$out/bg$n-1080p.mp4"
  echo "bg$n-1080p.mp4 $(stat -f %z "$out/bg$n-1080p.mp4" 2>/dev/null || stat -c %s "$out/bg$n-1080p.mp4") bytes"
done
