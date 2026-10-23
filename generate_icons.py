import os
from PIL import Image, ImageDraw

res_dir = os.path.abspath("android/app/src/main/res")
logo_path = os.path.abspath("public/doctohub-logo.png")

if not os.path.exists(logo_path):
    logo_path = os.path.abspath("assets/novea_logo.png")

print(f"Using source logo: {logo_path}")

base_img = Image.open(logo_path).convert("RGBA")

# Mipmap densities and sizes
mipmap_sizes = {
    "mipmap-mdpi": 48,
    "mipmap-hdpi": 72,
    "mipmap-xhdpi": 96,
    "mipmap-xxhdpi": 144,
    "mipmap-xxxhdpi": 192,
}

bg_color = (8, 17, 34, 255) # Dark navy #081122

for folder, size in mipmap_sizes.items():
    folder_path = os.path.join(res_dir, folder)
    os.makedirs(folder_path, exist_ok=True)

    # 1. Square Launcher Icon with Background
    canvas = Image.new("RGBA", (size, size), bg_color)
    # Scale logo with padding
    padded_size = int(size * 0.75)
    resized_logo = base_img.resize((padded_size, padded_size), Image.Resampling.LANCZOS)
    offset = ((size - padded_size) // 2, (size - padded_size) // 2)
    canvas.paste(resized_logo, offset, resized_logo)
    canvas.save(os.path.join(folder_path, "ic_launcher.png"), "PNG")

    # 2. Round Launcher Icon
    round_canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(round_canvas)
    draw.ellipse((0, 0, size, size), fill=bg_color)
    round_canvas.paste(resized_logo, offset, resized_logo)
    round_canvas.save(os.path.join(folder_path, "ic_launcher_round.png"), "PNG")

    # 3. Foreground Icon for Adaptive Icons
    fg_canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    fg_padded = int(size * 0.6)
    fg_resized = base_img.resize((fg_padded, fg_padded), Image.Resampling.LANCZOS)
    fg_offset = ((size - fg_padded) // 2, (size - fg_padded) // 2)
    fg_canvas.paste(fg_resized, fg_offset, fg_resized)
    fg_canvas.save(os.path.join(folder_path, "ic_launcher_foreground.png"), "PNG")

    print(f"Generated icons for {folder} ({size}x{size})")

# 4. Splash Screen Image (drawable/splash.png)
drawable_dir = os.path.join(res_dir, "drawable")
os.makedirs(drawable_dir, exist_ok=True)
splash_width, splash_height = 1080, 1920
splash_canvas = Image.new("RGBA", (splash_width, splash_height), bg_color)
splash_logo_size = 480
splash_logo = base_img.resize((splash_logo_size, splash_logo_size), Image.Resampling.LANCZOS)
splash_offset = ((splash_width - splash_logo_size) // 2, (splash_height - splash_logo_size) // 2)
splash_canvas.paste(splash_logo, splash_offset, splash_logo)
splash_canvas.save(os.path.join(drawable_dir, "splash.png"), "PNG")
print("Generated splash.png (1080x1920)")

print("All Android icon and splash screen resources successfully generated!")
