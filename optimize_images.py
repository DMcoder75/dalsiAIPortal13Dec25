from PIL import Image
import os
import glob

# Source and destination directories
src_dir = 'src/assets/products'
dest_dir = 'public/assets/products'

# Get all PNG files
png_files = glob.glob(f'{src_dir}/*.png')

print(f"Found {len(png_files)} images to optimize...")

for png_file in png_files:
    filename = os.path.basename(png_file)
    webp_filename = filename.replace('.png', '.webp')
    dest_path = os.path.join(dest_dir, webp_filename)
    
    # Open and optimize
    img = Image.open(png_file)
    
    # Resize if too large (max width 1200px)
    max_width = 1200
    if img.width > max_width:
        ratio = max_width / img.width
        new_height = int(img.height * ratio)
        img = img.resize((max_width, new_height), Image.Resampling.LANCZOS)
    
    # Save as WebP with quality 85
    img.save(dest_path, 'WEBP', quality=85, method=6)
    
    # Get file sizes
    original_size = os.path.getsize(png_file) / 1024
    optimized_size = os.path.getsize(dest_path) / 1024
    savings = ((original_size - optimized_size) / original_size) * 100
    
    print(f"✓ {filename}: {original_size:.1f}KB → {optimized_size:.1f}KB ({savings:.1f}% smaller)")

print("\n✅ All images optimized!")
