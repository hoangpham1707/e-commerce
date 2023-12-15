import numpy as np
import os
from keras.models import load_model
from keras.preprocessing import image
from keras.applications.inception_v3 import preprocess_input
from keras.preprocessing.image import img_to_array
import cv2

class Model:
    
    def __init__(self):
        self.model = None
    
    def predict(self, image):
        self.model = load_model('D:\\Document\\PTIT\\e-commerce\\Server_python\\train_model.h5')
        
        img = cv2.resize(image, (256, 256))

        i = img_to_array(img)

        i = preprocess_input(i)

        input_arr = np.array([i])

        input_arr.shape
        
        pred = np.argmax(self.model.predict(input_arr))
        
        if pred == 0:
            print("Anh cam")
            pred = 'Anh cam'
        if pred == 1:
            pred = 'Anh nong'
            print("Anh nong")
        if pred == 2:
            pred = 'Balo_vali'
            print("Balo")
        if pred == 3:
            pred = 'Sách'
            print("Book")
        if pred == 4:
            pred = 'Laptop'
            print("Laptop")
        if pred == 5:
            pred = 'Điện thoại'
            print("Smartphone")
        if pred == 6:
            pred = 'Thời trang nam'
            print("Vali")
        if pred == 7:
            pred = 'Đồng hồ_Trang sức'
            print("Watch")
        return pred
        
        
    def predict_comment(self, image):
        self.model = load_model('D:\\Document\\PTIT\\_Test\\filter_images\\train_model.h5')
        dic = {0: 'ảnh không phù hợp', 1: 'ảnh không phù hợp', 2: 'ảnh phù hợp', 3: 'ảnh phù hợp', 4: 'ảnh phù hợp', 5: 'ảnh phù hợp', 6: 'ảnh phù hợp', 7: 'ảnh phù hợp'}
        
        img = cv2.resize(image, (256, 256))

        i = img_to_array(img) / 255.0
        i = np.expand_dims(i, axis=0)  # Thêm chiều mới để phù hợp với shape của model (1, 256, 256, 3)
        p = self.model.predict(i)
        return dic[np.argmax(p)]