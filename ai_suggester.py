from google import genai

client = genai.Client(api_key="AIzaSyDBDCQ4aMqvIG6Jjbt0Z6M033UibM28yGE")


def suggest(code, language):
    suggestions = []
    explanation = ""

    # 🔥 Language-based checks
    if language == "python":
        if "print" not in code:
            suggestions.append("Use print() for output.")

    elif language == "c":
        if "#include" not in code:
            suggestions.append("Missing #include.")
        if "printf" not in code:
            suggestions.append("Use printf().")

    elif language == "cpp":
        if "#include<iostream>" not in code:
            suggestions.append("Use #include<iostream>.")
        if "cout" not in code:
            suggestions.append("Use cout.")

    elif language == "java":
        if "class" not in code:
            suggestions.append("Java needs a class.")
        if "System.out.println" not in code:
            suggestions.append("Use System.out.println().")

    explanation = get_ai_explanation(code, language)

    return suggestions, explanation

def auto_fix_code(code, language):
    fixed_code = code

    # 🔧 Fix Python print issue
    if language == "python":
        lines = fixed_code.split("\n")
        new_lines = []

        for line in lines:
            if line.strip().startswith("print ") and "(" not in line:
                content = line.replace("print ", "")
                line = f"print({content})"

            # Fix missing colon in loops/if
            if ("for " in line or "if " in line) and not line.strip().endswith(":"):
                line = line + ":"

            new_lines.append(line)

        fixed_code = "\n".join(new_lines)

    return fixed_code


# 🤖 AI FUNCTION + FALLBACK
def get_ai_explanation(code, language):
    try:
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=f"""
            You are an expert {language} code reviewer.

            Analyze this code and explain errors:

            {code}
            """
        )
        return response.text

    except:
        return basic_analysis(code, language)


# 🔧 FALLBACK
def basic_analysis(code, language):
    result = [f"🔧 Basic {language.upper()} Analysis:"]

    if len(code.strip()) == 0:
        result.append("⚠️ Code is empty.")

    if language in ["c", "cpp"] and ";" not in code:
        result.append("⚠️ Missing semicolons.")

    if language == "python" and ":" not in code:
        result.append("⚠️ Missing ':'.")

    if language == "java" and "main" not in code:
        result.append("⚠️ Missing main method.")

    return "\n".join(result)

def auto_fix_code(code, language):
    fixed_code = code

    if language == "python":
        lines = fixed_code.split("\n")
        new_lines = []

        for line in lines:

            # ✅ Fix print error
            if line.strip().startswith("print ") and "(" not in line:
                content = line.replace("print ", "")
                line = f"print({content})"

            # ✅ Fix missing colon
            if ("if " in line or "for " in line) and not line.strip().endswith(":"):
                line = line + ":"

            new_lines.append(line)

        fixed_code = "\n".join(new_lines)

    return fixed_code