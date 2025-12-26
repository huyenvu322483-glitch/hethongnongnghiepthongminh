/**
 * AI Detection Module - Real Model Implementation
 */

// Danh sách 34 nhãn của bạn
export const classNames = [
    'Apple___Apple_scab',
    'Apple___Black_rot',
    'Apple___Cedar_apple_rust',
    'Apple___healthy',
    'Blueberry___healthy',
    'Cherry_(including_sour)___Powdery_mildew',
    'Cherry_(including_sour)___healthy',
    'Grape___Black_rot',
    'Grape___Esca_(Black_Measles)',
    'Grape___Leaf_blight_(Isariopsis_Leaf_Spot)',
    'Grape___healthy',
    'Orange___Haunglongbing_(Citrus_greening)',
    'Peach___Bacterial_spot',
    'Peach___healthy',
    'Pepper,_bell___Bacterial_spot',
    'Pepper,_bell___healthy',
    'Potato___Early_blight',
    'Potato___Late_blight',
    'Potato___healthy',
    'Raspberry___healthy',
    'Soybean___healthy',
    'Squash___Powdery_mildew',
    'Strawberry___Leaf_scorch',
    'Strawberry___healthy',
    'Tomato___Bacterial_spot',
    'Tomato___Early_blight',
    'Tomato___Late_blight',
    'Tomato___Leaf_Mold',
    'Tomato___Septoria_leaf_spot',
    'Tomato___Spider_mites Two-spotted_spider_mite',
    'Tomato___Target_Spot',
    'Tomato___Tomato_Yellow_Leaf_Curl_Virus',
    'Tomato___Tomato_mosaic_virus',
    'Tomato___healthy'
]


let model;

// Tải model khi trang web khởi động
export async function loadPlantModel() {
    try {
        console.log("Đang tải AI Model...");
        model = await tf.loadLayersModel('../tfjs_model/model.json');
        console.log("Model AI đã tải thành công!");
    } catch (error) {
        console.error("Lỗi khi tải model:", error);
    }
}

/**
 * 3. Hàm dự đoán từ ảnh
 * Nhận đầu vào là thẻ <img> từ HTML
 */
export async function predictDisease(imageElement) {
    if (!model) {
        console.error("Model chưa được nạp!");
        return null;
    }

    try {
        // Tiền xử lý ảnh: Resize về [224, 224], chuyển về tensor, chuẩn hóa /255
        const tensor = tf.browser.fromPixels(imageElement)
            .resizeNearestNeighbor([224, 224]) 
            .toFloat()
            .div(tf.scalar(255.0))
            .expandDims();

        // Thực hiện dự đoán
        const predictions = await model.predict(tensor).data();
        
        // Lấy index của kết quả cao nhất
        const maxIndex = predictions.indexOf(Math.max(...predictions));
        const confidence = (predictions[maxIndex] * 100).toFixed(2);
        const name = classNames[maxIndex];

        return {
            name: name,
            confidence: confidence,
            isHealthy: name.toLowerCase().includes('healthy')
        };
    } catch (error) {
        console.error("Lỗi trong quá trình dự đoán:", error);
        return null;
    }
}