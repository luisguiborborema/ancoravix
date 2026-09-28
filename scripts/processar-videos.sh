#!/usr/bin/env bash
# Converte os vídeos originais (midia-originais/videos) em versões leves para a web (assets/video).
# Requer ffmpeg. Uso: bash scripts/processar-videos.sh
set -euo pipefail
cd "$(dirname "$0")/.."
V=midia-originais/videos
OUT=assets/video
IMG=assets/img/obras
mkdir -p "$OUT" "$IMG"

INST="$V/copy_33509C3B-5723-4145-9A8A-EDFED57DC179.MOV"              # institucional (iPhone, com som)
COBERTURA="$V/dji_fly_20260212_161430_0177_1770945394581_video.MP4"   # drone: cobertura com tela
FACHADA="$V/dji_fly_20260824_114214_0085_1787610660333_video.mp4"     # drone: prédio em reforma + mar

H264=(-c:v libx264 -profile:v high -pix_fmt yuv420p -preset slow -movflags +faststart)

# 1) Fundo do topo no celular: loop "vai e volta" (sem corte), sem som
ffmpeg -v error -y -i "$FACHADA" \
  -filter_complex "[0:v]fps=30,scale=540:-2:flags=lanczos,split[a][b];[b]reverse[r];[a][r]concat=n=2:v=1:a=0[v]" \
  -map "[v]" -an "${H264[@]}" -crf 29 -maxrate 1.2M -bufsize 2.4M "$OUT/hero-drone-mobile.mp4"

# 2) Galeria de obras: clipes curtos, sem som
ffmpeg -v error -y -i "$COBERTURA" -vf "fps=30,scale=720:-2:flags=lanczos" -an "${H264[@]}" -crf 27 "$OUT/obra-drone-cobertura.mp4"
ffmpeg -v error -y -i "$FACHADA"   -vf "fps=30,scale=720:-2:flags=lanczos" -an "${H264[@]}" -crf 27 "$OUT/obra-drone-fachada.mp4"

# 3) Vídeo institucional com som (carrega só ao clicar)
ffmpeg -v error -y -i "$INST" -vf "fps=30,scale=720:-2:flags=lanczos" "${H264[@]}" -crf 25 \
  -c:a aac -b:a 128k -ac 2 "$OUT/institucional-ancoravix.mp4"

# Capas (imagem mostrada antes do vídeo tocar)
ffmpeg -v error -y -ss 0.3 -i "$FACHADA"   -frames:v 1 -vf "scale=720:-2" -q:v 3 "$IMG/poster-hero-drone-mobile.jpg"  # depois converter para .webp
ffmpeg -v error -y -ss 3   -i "$COBERTURA" -frames:v 1 -vf "scale=720:-2" -q:v 3 "$IMG/poster-obra-drone-cobertura.jpg"  # depois converter para .webp
ffmpeg -v error -y -ss 4   -i "$FACHADA"   -frames:v 1 -vf "scale=720:-2" -q:v 3 "$IMG/poster-obra-drone-fachada.jpg"  # depois converter para .webp
ffmpeg -v error -y -ss 19  -i "$INST"      -frames:v 1 -vf "scale=720:-2" -q:v 3 "$IMG/poster-institucional.jpg"  # depois converter para .webp

ls -lh "$OUT" "$IMG"/poster-*
