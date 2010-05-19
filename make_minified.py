#!/usr/bin/env python

import urllib2
import urllib

code = ""

files = ["ui.labs-spinner.js", "json2.js", "colour.js", "widgets.js",
    "utilities.js", "colourtoy.js"]

for file in files:
    with open(file) as input:
        code += input.read()
        code += "\n;\n"

minified = urllib2.urlopen("http://closure-compiler.appspot.com/compile",
    urllib.urlencode({
        "js_code": code,
        "compilation_level": "SIMPLE_OPTIMIZATIONS",
        "output_format": "text",
        "output_info": "compiled_code"
    })).read()

with open("all-minified.js", "w") as output:
    output.write(minified)

with open("all.js", "w") as output:
    output.write(code)

print("Original:" + str(len(code)) + " in " + str(len(files)) + " files" +
      "\nMinified (SIMPLE_OPTIMIZATIONS):" + str(len(minified)) + " in 1 file")
