from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
from model import Model
import pymongo
from bson import ObjectId, json_util
from sklearn.metrics.pairwise import cosine_similarity
import cv2
import json
import csv
app = Flask(__name__)

CORS(app, supports_credentials=True, origins='http://localhost:3000')

app.config['CORS_HEADERS'] = 'Content-Type'


# mongo_connection_string = "mongodb+srv://commerce:commerce@cluster0.lygmgn5.mongodb.net/commerce?retryWrites=true&w=majority"
mongo_connection_string = "mongodb://localhost:27017/"


# Kết nối với MongoDB Atlas
client = pymongo.MongoClient(mongo_connection_string)
# client = pymongo.MongoClient("mongodb://localhost:27017/")
# database = client["commerce"]
database = client["test"]
products = pd.DataFrame(list(database["products"].find()))
products.sort_values('rate', inplace=True)
popular_products = products[products['numberOfReviews'] >=50]
final_df = products[products['_id'].isin(popular_products['_id'])]
pt = final_df.pivot_table(index='_id', columns='category', values='numberOfReviews')
print(pt.index)
pt.replace(np.nan, 0, inplace=True)
similarity = cosine_similarity(pt)
def get_top_rated_products(product_id):
    products = pd.DataFrame(list(database["products"].find()))
    if ObjectId(product_id) not in products['_id'].unique():
        print(f"Product ID {ObjectId(product_id)} không tồn tại trong danh sách sản phẩm.")
        return None
    target_product = products[products['_id'] == ObjectId(product_id)]
    target_category = target_product['category'].iloc[0]
    filtered_products = products[(products['category'] == target_category) & (products['numberOfReviews'] > 30)]
    filtered_products = filtered_products[filtered_products['_id'] != product_id]
    top_rated_products = filtered_products.sort_values('rate', ascending=False)
    top_10_rated_products = top_rated_products.head(10)
    return top_10_rated_products


#  kiểm tra xem item có phải là sản phẩm phổ biến hay không, nếu phải thì tính toán xem độ tương đồng là bn
#  x[1] là giá trị tương đồng chạy từ -1;1
#  danh sách recommend sẽ trả về các sp có độ tương đồng cao nhất từ trên xuống dưới , cho dù là sp phổ biến nhưng chưa chắc
#  tương đồng
#  có trường hợp chẳng đưa ra được recommend vì sp không có độ tương đồng
def recommedation_system(item):
    recommended_products_list = []
    if ObjectId(item) in pt.index:
        index = np.where(pt.index == ObjectId(item))[0][0]
        similarity_products = sorted(list(enumerate(similarity[index])), key=lambda x: x[1], reverse=True)[1:11]
        category_of_item = products.loc[products['_id'] == ObjectId(item), 'category'].values[0]
        for i in similarity_products:
            product_ID = pt.index[i[0]]
            if product_ID != ObjectId(item):
                product_info = products.loc[products['_id'] == product_ID]
                if len(product_info) > 0:
                    category_of_product = product_info['category'].values[0]
                    if category_of_product == category_of_item:
                        product_entry= {
                            "_id": str(product_info['_id'].values[0]),
                            "category": product_info['category'].values[0],
                            "name": product_info['name'].values[0],
                            "description": product_info['description'].values[0],
                            "rate": float(product_info['rate'].values[0]),
                            "images": product_info['images'].values[0],
                            "quantity": int(product_info['quantity'].values[0]),
                            "price": int(product_info['price'].values[0])
                        }
                        if product_entry not in recommended_products_list:
                            recommended_products_list.append(product_entry)
                        # recommended_products_list = json.dumps(recommended_products_list, indent=4)
    if len(recommended_products_list) < 10:
        top_rated_products = get_top_rated_products(ObjectId(item)).head(10 - len(recommended_products_list))
        top_rated_products_list = top_rated_products[
            ['_id', 'category', 'name', 'description', 'rate', 'images', 'quantity', 'price']].to_dict(orient='records')
        for product in top_rated_products_list:
            product_entry = {
                "_id": str(product["_id"]),
                "category": product["category"],
                "name": product["name"],
                "description": product["description"],
                "rate": float(product["rate"]),
                "images": product["images"],
                "quantity": int(product["quantity"]),
                "price": int(product["price"])
            }
            if product_entry not in recommended_products_list:
                recommended_products_list.append(product_entry)
    if len(recommended_products_list) < 10:
        product_info = products.loc[products['_id'] == ObjectId(item)]
        if not product_info.empty:
            category = product_info['category'].values[0]
            category_product = products.loc[(products['category'] == category) & (products['_id'] != ObjectId(item))]
            category_product = category_product.head(10 - len(recommended_products_list))
            for _, product in category_product.iterrows():
                product_entry={
                    "_id": str(product['_id']),
                    "category": product['category'],
                    "name": product['name'],
                    "description": product['description'],
                    "rate": float(product['rate']),
                    "images": product['images'],
                    "quantity": int(product['quantity']),
                    "price": int(product['price'])
                }
                if product_entry not in recommended_products_list:
                    recommended_products_list.append(product_entry)
    recommended_products_list = json.dumps(recommended_products_list, indent=4)
    print(recommended_products_list)
    return recommended_products_list

@app.route('/')
def home():
    return "Welcome to API Server predict image!!!"

@app.route('/test', methods=['POST'])
def test():
    try:
        data = request.get_json()['id']
        print(data)
        return jsonify(data)
    except Exception as e:
        print(e)

@app.route('/process-image', methods=['POST'])
def process_image():
    try:
        # Nhận dữ liệu hình ảnh từ microservice Node.js
        image_data = request.files["file"]
        file_bytes = np.asarray(bytearray(image_data.read()), dtype=np.uint8)
        image = cv2.imdecode(file_bytes, cv2.IMREAD_COLOR)
        model = Model()

        image_data = model.predict(image)
        # Trả về kết quả xử lý ảnh dưới dạng JSON
        return jsonify(image_data), 200
    except Exception as e:
        print(e)
        return jsonify({'message': 'Lỗi khi xử lý hình ảnh'}), 500
    
@app.route('/receive', methods=['POST', 'GET', 'PUT'])
def receive():
    if request.method == 'POST':
        data = request.json.get("obj_id")
        file_data = recommedation_system(data)
        return file_data
    
 
@app.route('/comment', methods=['POST'])
def comment():
    try:
        image_data = request.files['image']
        phrase_to_compare = request.form.get('phrase')
        file_bytes = np.asarray(bytearray(image_data.read()), dtype=np.uint8)
        image = cv2.imdecode(file_bytes, cv2.IMREAD_COLOR)
        model = Model()
        image_data = model.predict_comment(image)
        
        file_path = "D:\\Document\\PTIT\\_Test\\filter_images\\comment_toxic.csv"  # Thay "duong_dan_den_file.csv" bằng đường dẫn tới file CSV của bạn
        column_index_to_compare = 1  # (Đếm từ 0)
        
        found_words = find_words_in_column(file_path, column_index_to_compare, phrase_to_compare)
        
        response_data = {
            "result": found_words,
            "predicted_label": image_data
        }
        return jsonify(response_data), 200
    except Exception as e:
        print(e)
        return jsonify({'message': 'Lỗi khi xử lý hình ảnh'}), 500
    
def find_words_in_column(file_path, column_index, phrase_to_compare):
        # Đọc file CSV với encoding 'utf-8'
        with open(file_path, 'r', encoding='utf-8', errors='ignore') as csv_file:
            csv_reader = csv.reader(csv_file)

            # Tách cụm từ thành danh sách các từ riêng lẻ
            words_to_compare = phrase_to_compare.split()

            # Kiểm tra từng từ riêng lẻ có trong cột không
            found_words = []
            for row in csv_reader:
                if len(row) > column_index:
                    for word in words_to_compare:
                        if word == row[column_index]:
                            found_words.append(word)

        if found_words:
            return "Không hợp lệ!!!"
        else:
            return "Hợp lệ!"

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)