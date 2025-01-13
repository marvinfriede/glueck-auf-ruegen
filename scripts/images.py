#!/bin/env python3

# https://stackoverflow.com/questions/273946/how-do-i-resize-an-image-using-pil-and-maintain-its-aspect-ratio

from PIL import Image, ImageOps
from pathlib import Path


HERE = Path(__file__).resolve().parent


def thumbnail(file: Path, dest: Path, size: int = 200) -> None:
    with Image.open(file) as img:
        # Handle potential EXIF orientation
        ImageOps.exif_transpose(img, in_place=True)
        
        img.thumbnail((size, size))
        img.save(dest / f"{file.stem}.thumb{file.suffix}")


def resize(file: Path, dest: Path, basewidth: int = 200) -> None:
    with Image.open(file) as img:
        # Handle potential EXIF orientation
        ImageOps.exif_transpose(img, in_place=True)

        wpercent = basewidth / float(img.size[0])
        hsize = int((float(img.size[1]) * float(wpercent)))
        img = img.resize((basewidth, hsize))
        img.save(dest / f"{file.stem}.thumb{file.suffix}")


def optimize(
    file: Path, dest: Path, basewidth: int = 800, quality: int = 70
) -> None:
    with Image.open(file) as img:
        # Handle potential EXIF orientation
        ImageOps.exif_transpose(img, in_place=True)
        
        wpercent = basewidth / float(img.size[0])
        hsize = int((float(img.size[1]) * float(wpercent)))
        img = img.resize((basewidth, hsize))
        img.save(
            dest / f"{file.stem}.opt{file.suffix}",
            optimize=True,
            quality=quality,
        )


def main():
    # where to save the images
    dest = HERE.parent / "src" / "img"

    for path in Path(HERE / "img").iterdir():
        if not path.is_dir():
            continue

        for img in sorted(path.iterdir()):
            if not img.is_file():
                continue

            if img.suffix not in [".jpg", ".jpeg", ".png"]:
                continue

            print(path.name, img.name)
            resize(img, dest / path.name, 128)
            optimize(img, dest / path.name, 1600, 85)


if __name__ == "__main__":
    main()
