import subprocess
import os

img1 = "/app/applet/artifacts/bike-tour-booking/public/assets/aistudio/IMG_20261010_135534236_HDR_02ca2d6b.jpg"
img2 = "/app/applet/artifacts/bike-tour-booking/public/assets/aistudio/IMG_20261012_161823591_HDR_d112481d.jpg"
img3 = "/app/applet/artifacts/bike-tour-booking/public/assets/aistudio/IMG_20261011_130604499_HDR_9b9f92a9.jpg"
out_mp4 = "/app/applet/artifacts/bike-tour-booking/public/videos/maras-relive-tour.mp4"

# Generate 4 distinct video segments with ffmpeg and concatenate them
os.makedirs("/tmp/video_parts", exist_ok=True)

# Part 1: Intro telemetry card (3.5s)
cmd1 = [
    "ffmpeg", "-y", "-f", "lavfi",
    "-i", "color=c=0x15251d:s=1280x720:d=4",
    "-vf", (
        "drawbox=x=40:y=40:w=1200:h=640:color=0x233c30@0.8:t=fill,"
        "drawtext=text='BIKER 21 EN':fontcolor=0xffffff:fontsize=52:x=80:y=90,"
        "drawtext=text='JUAN GABRIEL SALAZAR\\'S RIDE · RELIVE GPS 3D':fontcolor=0xe2c992:fontsize=22:x=80:y=155,"
        "drawbox=x=80:y=200:w=1120:h=2:color=0x385544:t=fill,"
        "drawtext=text='36.5 km':fontcolor=0xffffff:fontsize=44:x=100:y=240,"
        "drawtext=text='DISTANCIA TOTAL':fontcolor=0xa0b3a6:fontsize=15:x=100:y=295,"
        "drawtext=text='5h 30m':fontcolor=0xffffff:fontsize=44:x=380:y=240,"
        "drawtext=text='TIEMPO EN RUTA':fontcolor=0xa0b3a6:fontsize=15:x=380:y=295,"
        "drawtext=text='+456 m':fontcolor=0xffffff:fontsize=44:x=660:y=240,"
        "drawtext=text='DESNIVEL POSITIVO':fontcolor=0xa0b3a6:fontsize=15:x=660:y=295,"
        "drawtext=text='3,791 m':fontcolor=0xffffff:fontsize=44:x=940:y=240,"
        "drawtext=text='ALTITUD MÁXIMA':fontcolor=0xa0b3a6:fontsize=15:x=940:y=295,"
        "drawbox=x=80:y=345:w=1120:h=2:color=0x385544:t=fill,"
        "drawtext=text='Puntos de paso: Cachimayo -> Chequerec -> Mahuaypampa -> Anccoto -> Maras -> Media Luna -> Urubamba':fontcolor=0xe0e7e2:fontsize=20:x=80:y=380,"
        "drawtext=text='Iniciando recreación de ruta 3D en los Andes...':fontcolor=0xf3c973:fontsize=22:x=80:y=440"
    ),
    "-c:v", "libx264", "-pix_fmt", "yuv420p", "-r", "30",
    "/tmp/video_parts/part1.mp4"
]

# Part 2: Image 1 zoompan with telemetry HUD (4s)
cmd2 = [
    "ffmpeg", "-y", "-loop", "1", "-i", img1,
    "-t", "5",
    "-vf", (
        "scale=1280:720:force_original_aspect_ratio=increase,crop=1280:720,"
        "zoompan=z='min(zoom+0.0015,1.15)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=150:s=1280x720:fps=30,"
        "drawbox=x=0:y=0:w=1280:h=90:color=0x14241b@0.85:t=fill,"
        "drawbox=x=0:y=630:w=1280:h=90:color=0x14241b@0.85:t=fill,"
        "drawtext=text='PUNTO CLAVE 01 · CACHIMAYO A ABRA DE MARAS':fontcolor=0xe5cd9b:fontsize=18:x=40:y=20,"
        "drawtext=text='Altitud: 3,791 msnm · Puna andina y senderos abiertos':fontcolor=0xffffff:fontsize=22:x=40:y=48,"
        "drawtext=text='Km 9.1 de 36.5':fontcolor=0xf2c974:fontsize=24:x=40:y=655,"
        "drawtext=text='Desnivel acumulado: +322m':fontcolor=0xffffff:fontsize=18:x=40:y=685,"
        "drawtext=text='Ritmo constante · Paisaje de puna':fontcolor=0xccd9d0:fontsize=18:x=860:y=665"
    ),
    "-c:v", "libx264", "-pix_fmt", "yuv420p", "-r", "30",
    "/tmp/video_parts/part2.mp4"
]

# Part 3: Image 2 zoompan with telemetry HUD (4.5s)
cmd3 = [
    "ffmpeg", "-y", "-loop", "1", "-i", img2,
    "-t", "5",
    "-vf", (
        "scale=1280:720:force_original_aspect_ratio=increase,crop=1280:720,"
        "zoompan=z='min(zoom+0.0015,1.15)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=150:s=1280x720:fps=30,"
        "drawbox=x=0:y=0:w=1280:h=90:color=0x14241b@0.85:t=fill,"
        "drawbox=x=0:y=630:w=1280:h=90:color=0x14241b@0.85:t=fill,"
        "drawtext=text='PUNTO CLAVE 02 · MAHUAYPAMPA Y MESETA DE MARAS':fontcolor=0xe5cd9b:fontsize=18:x=40:y=20,"
        "drawtext=text='Descenso fluido con guías locales · Vistas al cañón':fontcolor=0xffffff:fontsize=22:x=40:y=48,"
        "drawtext=text='Km 26.4 de 36.5':fontcolor=0xf2c974:fontsize=24:x=40:y=655,"
        "drawtext=text='Altitud: 3,380 msnm · Salineras a la vista':fontcolor=0xffffff:fontsize=18:x=40:y=685,"
        "drawtext=text='Grupo en ruta · Clima despejado':fontcolor=0xccd9d0:fontsize=18:x=860:y=665"
    ),
    "-c:v", "libx264", "-pix_fmt", "yuv420p", "-r", "30",
    "/tmp/video_parts/part3.mp4"
]

# Part 4: Image 3 zoompan with arrival telemetry (4.5s)
cmd4 = [
    "ffmpeg", "-y", "-loop", "1", "-i", img3,
    "-t", "5",
    "-vf", (
        "scale=1280:720:force_original_aspect_ratio=increase,crop=1280:720,"
        "zoompan=z='min(zoom+0.0015,1.15)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=150:s=1280x720:fps=30,"
        "drawbox=x=0:y=0:w=1280:h=90:color=0x14241b@0.85:t=fill,"
        "drawbox=x=0:y=630:w=1280:h=90:color=0x14241b@0.85:t=fill,"
        "drawtext=text='PUNTO CLAVE 03 · CAÑÓN DE MEDIA LUNA Y RÍO VILCANOTA':fontcolor=0xe5cd9b:fontsize=18:x=40:y=20,"
        "drawtext=text='Puente ferroviario histórico · Llegada al fondo del Valle':fontcolor=0xffffff:fontsize=22:x=40:y=48,"
        "drawtext=text='Km 36.5 · META CUMPLIDA':fontcolor=0x5ce68a:fontsize=24:x=40:y=655,"
        "drawtext=text='Tiempo final: 5h 30m · 2,870 msnm':fontcolor=0xffffff:fontsize=18:x=40:y=685,"
        "drawtext=text='Andes sobre Ruedas':fontcolor=0xf2c974:fontsize=22:x=960:y=665"
    ),
    "-c:v", "libx264", "-pix_fmt", "yuv420p", "-r", "30",
    "/tmp/video_parts/part4.mp4"
]

for cmd in [cmd1, cmd2, cmd3, cmd4]:
    print("Running part...")
    subprocess.run(cmd, check=True)

# Concatenate all parts
with open("/tmp/video_parts/list.txt", "w") as f:
    f.write("file '/tmp/video_parts/part1.mp4'\n")
    f.write("file '/tmp/video_parts/part2.mp4'\n")
    f.write("file '/tmp/video_parts/part3.mp4'\n")
    f.write("file '/tmp/video_parts/part4.mp4'\n")

concat_cmd = [
    "ffmpeg", "-y", "-f", "concat", "-safe", "0",
    "-i", "/tmp/video_parts/list.txt",
    "-c", "copy",
    out_mp4
]
print("Concatenating...")
subprocess.run(concat_cmd, check=True)
print("Finished creating:", out_mp4)
