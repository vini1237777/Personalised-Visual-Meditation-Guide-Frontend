#!/usr/bin/env bash
# Makes the 1080p background videos from the 4K sources.
#
#   ./perf/background-video/encode.sh <folder with bg1.mp4 to bg4.mp4> [output folder]
#
# 1080p is enough behind the page content. Each video gets a bitrate ceiling
# that fits its scene: the fast river in bg1 and bg3 needs up to 8 Mbps to keep
# the water sharp, the calmer bg2 and bg4 look the same at 3 Mbps. +faststart puts
# the index at the front, so the browser can show the first frame before the
# rest of the file arrives. Audio is dropped because the videos always play muted.
#
# Quality was checked with SSIM against the 4K source scaled to 1080p, and by eye
# on crops of the water.
set -euo pipefail

src="${1:?Pass the folder that holds bg1.mp4 to bg4.mp4}"
out="${2:-$src/1080p}"
mkdir -p "$out"

encode() {
  local name="$1" crf="$2" maxrate="$3" bufsize="$4" target="$5"
  ffmpeg -v error -y -i "$src/$name.mp4" -an \
    -vf "scale=1920:-2" \
    -c:v libx264 -preset slow -crf "$crf" -maxrate "$maxrate" -bufsize "$bufsize" \
    -pix_fmt yuv420p -movflags +faststart \
    "$out/$target"
  echo "$target $(stat -f %z "$out/$target" 2>/dev/null || stat -c %s "$out/$target") bytes"
}

encode bg1 21 8M 16M bg1-1080p-v2.mp4
encode bg2 26 3M 6M bg2-1080p.mp4
encode bg3 21 8M 16M bg3-1080p-v2.mp4
encode bg4 26 3M 6M bg4-1080p.mp4
