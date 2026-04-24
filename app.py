from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route("/analyze", methods=["POST"])
def analyze():
    data = request.get_json()
    code = data.get("code", "")

    score = 10
    quality_suggestions = []

    try:
        compile(code, "<string>", "exec")
        syntax_result = "✅ Syntax is correct"

    except SyntaxError as e:
        syntax_result = f"❌ Syntax Error on line {e.lineno}: {e.msg}"
        score -= 4
        quality_suggestions.append("Fix syntax errors before improving quality")

    # AI QUALITY CHECKS
    if len(code.splitlines()) > 10:
        score -= 1
        quality_suggestions.append("Consider splitting long code into functions")

    if "x =" in code or "y =" in code:
        score -= 1
        quality_suggestions.append("Use meaningful variable names instead of x or y")

    if "#" not in code:
        score -= 1
        quality_suggestions.append("Add comments for better readability")

    if "for" in code and "for" in code[code.find("for")+1:]:
        score -= 1
        quality_suggestions.append("Avoid nested loops if possible")

    if score < 0:
        score = 0

    explanation = " | ".join(quality_suggestions) if quality_suggestions else "Good quality code"

    return jsonify({
        "result": syntax_result,
        "score": f"{score}/10",
        "suggestions": explanation,
        "explanation": "AI quality analysis completed"
    })

@app.route("/fix", methods=["POST"])
def fix():
    data = request.get_json()
    code = data.get("code", "")

    lines = code.split("\n")
    fixed_lines = []

    for line in lines:
        stripped = line.strip()

        # Fix missing ':' for blocks
        if (
            stripped.startswith("if ")
            or stripped.startswith("for ")
            or stripped.startswith("while ")
            or stripped.startswith("def ")
        ) and not stripped.endswith(":"):
            line += ":"

        # Fix old print syntax
        if stripped.startswith("print ") and not stripped.startswith("print("):
            content = stripped[6:]
            line = f"print({content})"

        # Fix missing ')' in print(
        if "print(" in line and not line.strip().endswith(")"):
            line += ")"

        fixed_lines.append(line)

    fixed_code = "\n".join(fixed_lines)

    return jsonify({
        "fixed_code": fixed_code
    })

if __name__ == "__main__":
    app.run(debug=True, port=5001)