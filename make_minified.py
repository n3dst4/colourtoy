#!/usr/bin/env python

import urllib2
import urllib

code = ""

js_files = ["ui.labs-spinner.js", "json2.js", "colour.js", "widgets.js",
    "utilities.js", "colourtoy.js"]

css_files = ["css/html5reset-1.4.1.css", "css/jquery-ui.dark.css",
    "css/jquery-ui.light.css", "css/colourtoy-light.css",
    "css/colourtoy-dark.css", "css/ui.labs-spinner.css", "css/colourtoy.css"]

for file in js_files:
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

#with open("all.js", "w") as output:
#    output.write(code)

print("Original JS:" + str(len(code)) + " in " + str(len(js_files)) + " files" +
      "\nMinified (SIMPLE_OPTIMIZATIONS):" + str(len(minified)) + " in 1 file")


code = ""
for file in css_files:
    with open(file) as input:
        code += input.read()
        code += "\n"
        
with open("css/all-minified.css", "w") as output:
    output.write(code)

