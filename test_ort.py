import onnxruntime as ort
import cv2
import numpy as np
import base64
import sys

def test_ort():
    try:
        session = ort.InferenceSession("best.onnx", providers=["CPUExecutionProvider"])
        
        # preprocessing
        img_path = "flood-dataset/val/banjir/banjir_0079_Image_95.jpg"
        img = cv2.imread(img_path)
        img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        img = cv2.resize(img, (224, 224))
        
        img = img.astype(np.float32) / 255.0
        img = img.transpose(2, 0, 1) # HWC to CHW
        img = np.expand_dims(img, axis=0) # add batch dim
        
        input_name = session.get_inputs()[0].name
        output_name = session.get_outputs()[0].name
        
        outputs = session.run([output_name], {input_name: img})
        print(outputs)
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_ort()
