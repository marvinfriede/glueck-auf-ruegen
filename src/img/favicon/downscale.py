# https://stackoverflow.com/questions/273946/how-do-i-resize-an-image-using-pil-and-maintain-its-aspect-ratio

from PIL import Image
from glob import glob
import os


projectPath = "/home/marvin/Dokumente/glueck-auf-ruegen/src/img/" + os.path.basename(os.getcwd()) + "/"


def thumbnail(files, size=200):
  for infile in files:
    file, ext = os.path.splitext(infile)
    format = 'jpeg' if ext[1:].lower() == 'jpg' else ext[1:]

    with Image.open(infile) as img:
      img.thumbnail(size)
      img.save(file + ".thumb" + ext, format)


def resize(files, basewidth=200):
  for infile in files:
    file, ext = os.path.splitext(infile)
    format = 'jpeg' if ext[1:].lower() == 'jpg' else ext[1:]

    with Image.open(infile) as img:
      wpercent = (basewidth / float(img.size[0]))
      hsize = int((float(img.size[1]) * float(wpercent)))
      img = img.resize((basewidth, hsize))
      img.save(file + ".thumb" + ext, format)


def optimize(files, basewidth=800, quality=70):
  for infile in files:
    file, ext = os.path.splitext(infile)
    format = 'jpeg' if ext[1:].lower() == 'jpg' else ext[1:]

    with Image.open(infile) as img:
      wpercent = (basewidth / float(img.size[0]))
      hsize = int((float(img.size[1]) * float(wpercent)))
      img = img.resize((basewidth, hsize))
      img.save(projectPath + file + ".opt" + ext, format, optimize=True, quality=quality)


def main():
  imageFiles = glob("*.jpg") + glob("*.jpeg") + glob("*.png")
  print("Saving to: ", projectPath)

  #thumbnail(imageFiles)
  #resize(imageFiles, 128)
  optimize(imageFiles, 512, 100)

if __name__ == '__main__':
  main()
