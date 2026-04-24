import subprocess
import os

# 🔹 Function to format output (adds labels)
def format_output(output):
    lines = output.split("\n")
    formatted = []

    for line in lines:
        if "error" in line.lower():
            formatted.append(f"<span style='color:red;'>[ERROR] {line}</span>")
        elif "warning" in line.lower():
            formatted.append(f"<span style='color:orange;'>[WARNING] {line}</span>")
        else:
            formatted.append(f"<span style='color:white;'>{line}</span>")

    return "<br>".join(formatted)
 

# 🔹 Main analyzer function
def analyze_code(code):
    try:
        file_name = "temp_code.py"

        # Clean input (IMPORTANT FIX)
        clean_code = code.replace("\r", "").strip()

        # Save code to temp file
        with open(file_name, "w", encoding="utf-8") as f:
            f.write(clean_code)

        # Run pylint
        result = subprocess.run(
            ["pylint", file_name],
            capture_output=True,
            text=True
        )

        output = result.stdout

        # Apply formatting (NEW FEATURE)
        final_output = format_output(output)

        # Delete temp file
        if os.path.exists(file_name):
            os.remove(file_name)

        return final_output

    except Exception as e:
        return f"Error occurred: {str(e)}"