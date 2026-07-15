#!/bin/bash

mkdir -p web/products

for img in darktable/*.jpg
do
    magick "$img" \
        -resize "1200x1500^" \
        -gravity center \
        -extent 1200x1500 \
        -quality 85 \
        "web/products/$(basename "${img%.*}").avif"
done
