from PIL import Image
import collections

def get_colors(image_path):
    try:
        img = Image.open(image_path)
        img = img.convert('RGB')
        # Resize to speed up and get dominant colors
        img = img.resize((150, 150))
        colors = img.getcolors(150 * 150)
        
        # Sort by count
        sorted_colors = sorted(colors, key=lambda x: x[0], reverse=True)
        
        print("Top 5 Colors:")
        for count, color in sorted_colors[:5]:
            hex_color = '#{:02x}{:02x}{:02x}'.format(*color)
            print(f"{hex_color} (Count: {count})")
            
        # Get corners to see if it's a gradient
        width, height = img.size
        left_color = img.getpixel((0, height // 2))
        right_color = img.getpixel((width - 1, height // 2))
        
        print("\nGradient Check:")
        print(f"Left: #{'{:02x}{:02x}{:02x}'.format(*left_color)}")
        print(f"Right: #{'{:02x}{:02x}{:02x}'.format(*right_color)}")

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    get_colors('/Users/sunny/.gemini/antigravity/brain/e72be87d-be78-4b16-904c-43df93d214f7/uploaded_image_1763873971397.png')
