#!/usr/bin/bash

for i in `seq 10`
do

node src/mapping.js -i test/example/example_$i.json -o test/example/$i.svg -c config/config.json
node src/convert.js -i test/example/$i.svg -o test/example_image/$i.png
rm test/example/$i.svg

done
