import os
from PIL import Image

source_path = r"C:\Users\Admin\Downloads\app-main\.aistudio\artifacts\brain\607545a1-e982-49b1-b8c9-d6d6e62aa045\.tempmediaStorage\media_1792568867930_b917831e.png"
if not os.path.exists(source_path):
    print("Source image not found!")
    exit(1)

img = Image.open(source_path).convert("RGBA")

# 1. Save official logo copies in project
os.makedirs(r"C:\Users\Admin\Downloads\app-main\assets", exist_ok=True)
img.save(r"C:\Users\Admin\Downloads\app-main\assets\novea_logo.png")
os.makedirs(r"C:\Users\Admin\Downloads\app-main\android\app\src\main\assets", exist_ok=True)
img.save(r"C:\Users\Admin\Downloads\app-main\android\app\src\main\assets\novea_logo.png")

# 2. Generate Mipmap densities for launcher icons
densities = {
    "mipmap-mdpi": 48,
    "mipmap-hdpi": 72,
    "mipmap-xhdpi": 96,
    "mipmap-xxhdpi": 144,
    "mipmap-xxxhdpi": 192
}

res_dir = r"C:\Users\Admin\Downloads\app-main\android\app\src\main\res"

for folder, size in densities.items():
    d_path = os.path.join(res_dir, folder)
    os.makedirs(d_path, exist_ok=True)

    resized = img.resize((size, size), Image.Resampling.LANCZOS)
    resized.save(os.path.join(d_path, "ic_launcher.png"))
    resized.save(os.path.join(d_path, "ic_launcher_round.png"))
    resized.save(os.path.join(d_path, "ic_launcher_foreground.png"))

# 3. Generate adaptive-icon XMLs
anydpi_dir = os.path.join(res_dir, "mipmap-anydpi-v26")
os.makedirs(anydpi_dir, exist_ok=True)

ic_launcher_xml = '''<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@color/ic_launcher_background"/>
    <foreground android:mipmap="@mipmap/ic_launcher_foreground"/>
</adaptive-icon>
'''

with open(os.path.join(anydpi_dir, "ic_launcher.xml"), "w") as f:
    f.write(ic_launcher_xml)

with open(os.path.join(anydpi_dir, "ic_launcher_round.xml"), "w") as f:
    f.write(ic_launcher_xml)

# 4. Generate ic_launcher_background.xml in values
values_dir = os.path.join(res_dir, "values")
os.makedirs(values_dir, exist_ok=True)

bg_xml = '''<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="ic_launcher_background">#070B18</color>
</resources>
'''

# append or create color definition
with open(os.path.join(values_dir, "colors.xml"), "r") as f:
    colors_content = f.read()

if "ic_launcher_background" not in colors_content:
    colors_content = colors_content.replace("</resources>", '    <color name="ic_launcher_background">#070B18</color>\n</resources>')
    with open(os.path.join(values_dir, "colors.xml"), "w") as f:
        f.write(colors_content)

# 5. Generate Splash Screen image (centered logo on #070B18 background)
splash_dir = os.path.join(res_dir, "drawable")
os.makedirs(splash_dir, exist_ok=True)

splash_bg = Image.new("RGBA", (512, 512), (7, 11, 24, 255)) # #070B18
logo_resized = img.resize((300, 300), Image.Resampling.LANCZOS)
splash_bg.paste(logo_resized, (106, 106), logo_resized)
splash_bg.save(os.path.join(splash_dir, "splash.png"))

print("Icons and splash screen generated successfully!")
