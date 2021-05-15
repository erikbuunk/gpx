# Retrieve the gpx files in the assetes directory

import os

path = "assets"
files = os.listdir(path)

f_out = open("files.js", "w")
f_out.write("var files = [\n")

for f in sorted(files):
    if (f[len(f)-4:] == ".gpx"):
        name = f.split(".")[0]
        text = f"\t\"{name}\",\n"
        f_out.write(text)

f_out.write("]")
f_out.close()
