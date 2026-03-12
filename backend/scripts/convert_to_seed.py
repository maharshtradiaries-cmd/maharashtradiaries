import re
import json

def convert_ts_to_js_seed():
    ts_path = r'c:\Users\HAIDER\OneDrive\Desktop\PROJECTS\Adhitya\maharashtra-diaries-new\frontend\src\data\destinations.ts'
    js_path = r'c:\Users\HAIDER\OneDrive\Desktop\PROJECTS\Adhitya\maharashtra-diaries-new\backend\seedData.js'
    
    with open(ts_path, 'r', encoding='utf-8') as f:
        content = f.read()
        
    # Find the array content
    match = re.search(r'export const destinations: Destination\[\] = (\[.*\]);', content, re.DOTALL)
    if not match:
        print("Could not find destinations array in TS file")
        return
        
    array_content = match.group(1)
    
    # Write to JS file
    with open(js_path, 'w', encoding='utf-8') as f:
        f.write("const destinations = " + array_content + ";\n\nmodule.exports = { destinations };")
        
    print(f"Successfully created {js_path}")

if __name__ == "__main__":
    convert_ts_to_js_seed()
