import detect_flood
import base64
import json

with open("flood-dataset/val/banjir/banjir_0079_Image_95.jpg", "rb") as f:
    b64 = base64.b64encode(f.read()).decode("utf-8")

result = detect_flood.predict_from_base64(b64)
print("Result Output:")
print(json.dumps(result, indent=2))
