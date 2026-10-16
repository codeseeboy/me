#!/usr/bin/env bash
# Renders the three product films (1080p) with their posters, and the hero
# ring's cards — portrait stills of each product, drawn from the same
# components the gallery animates.
#   bash scripts/render-films.sh          films (if missing), posters, ring cards
#   bash scripts/render-films.sh posters  posters and ring cards only
set -e
cd "$(dirname "$0")/.."
ENTRY=remotion/index.ts
OUT=public/videos
RING=public/ring
mkdir -p "$OUT" "$RING"

film() { npx remotion render $ENTRY "$1" "$OUT/$2.mp4" --codec=h264 --crf=22 --concurrency=6; }
poster() { npx remotion still $ENTRY "$1" "$OUT/$2.jpg" --frame="$3" --image-format=jpeg --jpeg-quality=82 --props='{"clean":true}'; }
card() { npx remotion still $ENTRY Ring "$RING/$1.jpg" --image-format=jpeg --jpeg-quality=86 --props="{\"kind\":\"$1\"}"; }

[ "$1" = "posters" ] || {
  [ -f "$OUT/privacy-guardian.mp4" ] || film PgFilm privacy-guardian
  [ -f "$OUT/live-desktop.mp4" ] || film LiveFilm live-desktop
  [ -f "$OUT/mediator.mp4" ] || film MedFilm mediator
}

poster PgFilm privacy-guardian 345
poster LiveFilm live-desktop 588
poster MedFilm mediator 900

for k in non8 guardian mediator desk mesh civic; do card "$k"; done
echo "done"
