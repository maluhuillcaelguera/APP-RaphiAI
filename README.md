# 🌿 RaphiAI – Detección de Enfermedades en Hojas de Papa

**RaphiAI** es una aplicación móvil basada en **Inteligencia Artificial** que permite predecir **enfermedades foliares en hojas de papa** a partir de imágenes, utilizando un modelo de **Deep Learning VGG16**.  
La aplicación está orientada al **diagnóstico temprano**, apoyando la agricultura de precisión y la investigación académica.

---

## 🚀 Características principales

- 📸 Captura de imágenes desde la cámara del dispositivo
- 🤖 Predicción automática de enfermedades en hojas de papa
- 🧠 Modelo CNN basado en **VGG16**
- 📊 Clasificación multiclase (incluye hoja sana)
- 📱 Aplicación móvil desarrollada en **React Native**
- 🌱 Enfoque en agricultura, innovación y apoyo a agricultores

---

## 🧠 Modelo de Inteligencia Artificial

- **Arquitectura:** VGG16  Descarga aqui: https://drive.google.com/drive/folders/1w3bnPl25PvUy37wQNNc2etROvPh5mWhe?usp=drive_link  
- **Tipo:** Red Neuronal Convolucional (CNN)
- **Pesos:** Inicializados a partir de ImageNet (transfer learning)
- **Framework:** TensorFlow / Keras
- **Entrada:** Imágenes RGB redimensionadas
- **Salida:** Clase de enfermedad predicha

### 📂 Clases del modelo
- Healthy (Hoja sana)
- Early Blight
- Late Blight
- Leafroll Virus
- Mosaic Virus

---

## 📱 Tecnologías utilizadas

### Frontend (App móvil)
- React Native
- Expo
- Expo Camera
- Expo Router

### Backend / IA
- Python
- FastAPI
- TensorFlow / Keras
- NumPy
- OpenCV

---

## ⚙️ Funcionamiento general

1. El usuario captura una imagen de la hoja de papa
2. La imagen es enviada a la API
3. El modelo VGG16 procesa la imagen
4. Se predice la enfermedad correspondiente
5. El resultado se muestra en la aplicación

---

## 📦 Instalación (Frontend)

```bash
git clone https://github.com/tu-usuario/raphiAI.git
cd raphiAI
npm install
npx expo start
