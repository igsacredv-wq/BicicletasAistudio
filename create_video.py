import subprocess
import os

img1 = "/app/applet/artifacts/bike-tour-booking/public/assets/aistudio/IMG_20261010_135534236_HDR_02ca2d6b.jpg"
img2 = "/app/applet/artifacts/bike-tour-booking/public/assets/aistudio/IMG_20261012_161823591_HDR_d112481d.jpg"
img3 = "/app/applet/artifacts/bike-tour-booking/public/assets/aistudio/IMG_20261011_130604499_HDR_9b9f92a9.jpg"
out_mp4 = "/app/applet/artifacts/bike-tour-booking/public/videos/maras-relive-tour.mp4"

os.makedirs("/tmp/video_parts", exist_ok=True)
os.makedirs("/app/applet/artifacts/bike-tour-booking/public/videos", exist_ok=True)

# Part 1: Intro card (3.5s)
cmd1 = [
    "ffmpeg", "-y", "-f", "lavfi",
    "-i", "color=c=0x15251d:s=1280x720:d=4",
    "-vf", (
        "drawbox=x=40:y=40:w=1200:h=640:color=0x223a2d:t=fill,"
        "drawtext=text='BIKER 21 EN - RUTA 3D RELIVE':fontsize=48:fontcolor=white:x=80:y=100,"
        "drawtext=text='JUAN GABRIEL SALAZAR RIDE - 21 ENERO 2024':fontsize=22:fontcolor=0xe5cd9b:x=80:y=165,"
        "drawtext=text='DISTANCIA: 36.5 km':fontsize=32:fontcolor=white:x=80:y=250,"
        "drawtext=text='TIEMPO: 5h 30m':fontsize=32:fontcolor=white:x=450:y=250,"
        "drawtext=text='DESNIVEL: +456 m':fontsize=32:fontcolor=white:x=750:y=250,"
        "drawtext=text='MAX ALTITUD: 3791 m':fontsize=32:fontcolor=white:x=80:y=330,"
        "drawtext=text='VELOCIDAD MEDIA: 6.6 km/h':fontsize=32:fontcolor=white:x=450:y=330,"
        "drawtext=text='Cachimayo - Chequerec - Mahuaypampa - Anccoto - Maras - Media Luna - Urubamba':fontsize=20:fontcolor=0xd1dfd6:x=80:y=430,"
        "drawtext=text='RECORRIDO EN BICICLETA DE MONTANA POR EL VALLE SAGRADO':fontsize=20:fontcolor=0xf3c973:x=80:y=480"
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
        "drawbox=x=0:y=0:w=1280:h=90:color=0x14241b@0.85:t=fill,"
        "drawbox=x=0:y=630:w=1280:h=90:color=0x14241b@0.85:t=fill,"
        "drawtext=text='PUNTO 01 - CACHIMAYO A ABRA DE MARAS':fontsize=20:fontcolor=0xe5cd9b:x=40:y=20,"
        "drawtext=text='Altitud: 3791 msnm - Puna andina y senderos abiertos':fontsize=22:fontcolor=white:x=40:y=50,"
        "drawtext=text='Km 9.1 de 36.5':fontsize=24:fontcolor=0xf2c974:x=40:y=655,"
        "drawtext=text='Desnivel acumulado: +322m':fontsize=18:fontcolor=white:x=40:y=685,"
        "drawtext=text='Cabañas rusticas de piedra y campos altos':fontsize=18:fontcolor=0xccd9d0:x=800:y=665"
    ),
    "-c:v", "libx264", "-pix_fmt", "yuv420p", "-r", "30",
    "/tmp/video_parts/part2.mp4"
]

# Part 3: Image 2 zoompan with telemetry HUD (4s)
cmd3 = [
    "ffmpeg", "-y", "-loop", "1", "-i", img2,
    "-t", "5",
    "-vf", (
        "scale=1280:720:force_original_aspect_ratio=increase,crop=1280:720,"
        "drawbox=x=0:y=0:w=1280:h=90:color=0x14241b@0.85:t=fill,"
        "drawbox=x=0:y=630:w=1280:h=90:color=0x14241b@0.85:t=fill,"
        "drawtext=text='PUNTO 02 - MAHUAYPAMPA Y MESETA DE MARAS':fontsize=20:fontcolor=0xe5cd9b:x=40:y=20,"
        "drawtext=text='Descenso fluido con guias locales - Vistas al canon':fontsize=22:fontcolor=white:x=40:y=50,"
        "drawtext=text='Km 26.4 de 36.5':fontsize=24:fontcolor=0xf2c974:x=40:y=655,"
        "drawtext=text='Altitud: 3380 msnm - Salineras a la vista':fontsize=18:fontcolor=white:x=40:y=685,"
        "drawtext=text='Grupo de ciclistas en ruta':fontsize=18:fontcolor=0xccd9d0:x=880:y=665"
    ),
    "-c:v", "libx264", "-pix_fmt", "yuv420p", "-r", "30",
    "/tmp/video_parts/part3.mp4"
]

# Part 4: Image 3 zoompan with arrival telemetry (4s)
cmd4 = [
    "ffmpeg", "-y", "-loop", "1", "-i", img3,
    "-t", "5",
    "-vf", (
        "scale=1280:720:force_original_aspect_ratio=increase,crop=1280:720,"
        "drawbox=x=0:y=0:w=1280:h=90:color=0x14241b@0.85:t=fill,"
        "drawbox=x=0:y=630:w=1280:h=90:color=0x14241b@0.85:t=fill,"
        "drawtext=text='PUNTO 03 - CANON DE MEDIA LUNA Y RIO VILCANOTA':fontsize=20:fontcolor=0xe5cd9b:x=40:y=20,"
        "drawtext=text='Puente ferroviario historico - Llegada al fondo del Valle':fontsize=22:fontcolor=white:x=40:y=50,"
        "drawtext=text='Km 36.5 - META CUMPLIDA':fontsize=24:fontcolor=0x5ce68a:x=40:y=655,"
        "drawtext=text='Tiempo final: 5h 30m - 2870 msnm':fontsize=18:fontcolor=white:x=40:y=685,"
        "drawtext=text='Andes sobre Ruedas':fontsize=22:fontcolor=0xf2c974:x=960:y=665"
    ),
    "-c:v", "libx264", "-pix_fmt", "yuv420p", "-r", "30",
    "/tmp/video_parts/part4.mp4"
]

for i, cmd in enumerate([cmd1, cmd2, cmd3, cmd4], 1):
    print(f"Generating part {i}...")
    subprocess.run(cmd, check=True)

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
print("Concatenating into final MP4...")
subprocess.run(concat_cmd, check=True)
print("SUCCESS: Generated", out_mp4)
