# detect_flood.py
import sys, base64, json, cv2, numpy as np, os
import onnxruntime as ort

MODEL_PATH = os.path.join(os.path.dirname(__file__), "best.onnx")

# Load model ONNX using pure onnxruntime (lightweight)
try:
    session = ort.InferenceSession(MODEL_PATH, providers=["CPUExecutionProvider"])
    print(f"✅ Model loaded: {MODEL_PATH}", file=sys.stderr)
except Exception as e:
    print(f"❌ Gagal load model: {e}", file=sys.stderr)
    sys.exit(1)

def predict_from_base64(b64_string):
    try:
        # Hapus prefix base64 jika ada
        if "," in b64_string:
            b64_string = b64_string.split(",")[1]
        
        # Decode ke numpy array
        img_data = base64.b64decode(b64_string)
        img = cv2.imdecode(np.frombuffer(img_data, np.uint8), cv2.IMREAD_COLOR)
        
        if img is None:
            return {"status": "ERROR", "confidence": 0}
        
        # Preprocessing khusus untuk klasifikasi
        img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        img = cv2.resize(img, (224, 224))
        img = img.astype(np.float32) / 255.0
        img = img.transpose(2, 0, 1) # HWC ke CHW
        img = np.expand_dims(img, axis=0) # Tambahkan batch dimension

        # Inference murni via ONNXRuntime
        input_name = session.get_inputs()[0].name
        output_name = session.get_outputs()[0].name
        outputs = session.run([output_name], {input_name: img})[0]
        
        # Ekstrak class probability [banjir, normal]
        # Pastikan softmax untuk probabilitas jika keluaran model masih berupa logitmentah 
        # (Beberapa model ekspor YOLO mengembalikan probabilitas langsung)
        probs = outputs[0]
        
        # Sesuai data mapping {0: 'banjir', 1: 'normal'}
        conf_banjir = float(probs[0])
        
        # Threshold logic (bisa disesuaikan)
        if conf_banjir > 0.72:
            return {"status": "FLOOD", "confidence": round(conf_banjir * 100, 1)}
        elif conf_banjir > 0.48:
            return {"status": "RISING", "confidence": round(conf_banjir * 100, 1)}
        else:
            return {"status": "SAFE", "confidence": round((1 - conf_banjir) * 100, 1)}
            
    except Exception as e:
        return {"status": "ERROR", "confidence": 0, "message": str(e)}

if __name__ == "__main__":
    input_data = sys.argv[1] if len(sys.argv) > 1 else sys.stdin.read().strip()
    if not input_data:
        print(json.dumps({"status": "ERROR", "confidence": 0}))
        sys.exit(1)
    result = predict_from_base64(input_data)
    print(json.dumps(result))