#!/usr/bin/env bash
set -e
D=/tmp/claude-0/-home-user-project-2/cefb6be1-f20f-5ae5-aad8-4ae795c98c78/scratchpad
F=$D/frames
W=$D/work
mkdir -p "$W"
FPS=30
XF=0.4   # crossfade duration

# per-scene durations (seconds)
DUR=(0 3.0 3.4 2.8 3.0 2.8 2.6 3.0 4.0)

# 1) build each scene clip with subtle Ken-Burns motion
for i in $(seq 1 8); do
  d=${DUR[$i]}
  frames=$(python3 -c "print(int($d*$FPS))")
  if [ $((i % 2)) -eq 1 ]; then
    # zoom in
    z="z='min(zoom+0.0010,1.11)'"
  else
    # zoom out
    z="z='if(eq(on,1),1.11,max(zoom-0.0010,1.0))'"
  fi
  ffmpeg -v error -y -loop 1 -i "$F/scene$i.png" \
    -vf "scale=2160:3840,zoompan=${z}:d=${frames}:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=1080x1920:fps=${FPS},format=yuv420p,setsar=1" \
    -t "$d" -c:v libx264 -preset medium -crf 18 "$W/c$i.mp4"
  echo "built c$i ($d s)"
done

# 2) crossfade-chain the 8 clips
inputs=""
for i in $(seq 1 8); do inputs="$inputs -i $W/c$i.mp4"; done

# compute cumulative xfade offsets
python3 - "$XF" "${DUR[@]:1}" > "$W/fc.txt" <<'PY'
import sys
xf=float(sys.argv[1]); durs=[float(x) for x in sys.argv[2:]]
n=len(durs)
lines=[]; prev="[0:v]"; off=durs[0]-xf
for i in range(1,n):
    out=f"[x{i}]" if i<n-1 else "[v]"
    lines.append(f"{prev}[{i}:v]xfade=transition=fade:duration={xf}:offset={off:.3f}{out};")
    prev=out
    off+=durs[i]-xf
# strip trailing ; on last
fc="".join(lines)
if fc.endswith(';'): fc=fc[:-1]
print(fc)
PY
FC=$(cat "$W/fc.txt")
total=$(python3 -c "d=[${DUR[1]},${DUR[2]},${DUR[3]},${DUR[4]},${DUR[5]},${DUR[6]},${DUR[7]},${DUR[8]}]; print(round(sum(d)-7*$XF,3))")
echo "total video = $total s"

ffmpeg -v error -y $inputs -filter_complex "$FC" -map "[v]" \
  -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p -movflags +faststart "$W/video_noaudio.mp4"
echo "video assembled"

# 3) ambient audio bed (A-major pad + gentle pulse), sized to total
ffmpeg -v error -y \
  -f lavfi -i "sine=frequency=110:duration=$total" \
  -f lavfi -i "sine=frequency=220:duration=$total" \
  -f lavfi -i "sine=frequency=277.18:duration=$total" \
  -f lavfi -i "sine=frequency=329.63:duration=$total" \
  -filter_complex "[0]volume=0.20[a0];[1]volume=0.14[a1];[2]volume=0.10[a2];[3]volume=0.09[a3];\
[a0][a1][a2][a3]amix=inputs=4:normalize=0,\
lowpass=f=1300,highpass=f=70,tremolo=f=1.9:d=0.55,\
aecho=0.8:0.85:220:0.25,\
afade=t=in:st=0:d=1.2,afade=t=out:st=$(python3 -c "print(round($total-1.4,3))"):d=1.4,\
volume=0.5,alimiter=limit=0.9,aformat=channel_layouts=stereo,aresample=48000[aout]" \
  -map "[aout]" -c:a aac -b:a 192k "$W/bed.m4a"
echo "audio built"

# 4) mux
ffmpeg -v error -y -i "$W/video_noaudio.mp4" -i "$W/bed.m4a" \
  -c:v copy -c:a aac -b:a 192k -shortest -movflags +faststart "$D/TriScreen_viral.mp4"
echo "DONE -> $D/TriScreen_viral.mp4"
ffprobe -v error -show_entries format=duration,size -of default=noprint_wrappers=1 "$D/TriScreen_viral.mp4"
