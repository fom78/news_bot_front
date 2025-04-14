# 📰 Intelligent News Subscriptions - Frontend

Este es el cliente web de **Intelligent News Subscriptions**, una aplicación que permite a los usuarios subscribirse a noticias personalizadas mediante un bot conversacional.

Este proyecto es parte de un **Ejercicio de Evaluación Técnica**:

---

## 🚀 Tecnologías utilizadas

- **React 19**
- **React Router DOM**
- **Tailwind CSS**
- **i18next** para internacionalización
- **Axios** para peticiones HTTP
- **React Hot Toast** para notificaciones
- **Vite** como bundler ultrarrápido
- **ESLint** para análisis estático de código

---

## 🌐 Características principales

✅ Registro e inicio de sesión con teléfono  
✅ Gestión de suscripciones a categorías de noticias  
✅ Interfaz amigable y responsiva  
✅ Selector de idioma (Español / Inglés / Portugués)  
✅ Cambio de tema claro/oscuro  
✅ Protección de rutas mediante autenticación  
✅ Notificaciones elegantes con `react-hot-toast`

---

## 🧠 Estructura general

```
src/
├── components/         # Componentes reutilizables
├── context/            # Contextos para Auth y Theme
├── i18n/               # Configuración de idiomas
├── App.jsx             # Enrutamiento y navegación
└── index.jsx           # Punto de entrada de la app
```

---

## 📦 Instalación

1. Clona el repositorio:

```bash
git clone https://github.com/fom78/news_bot_front
cd news_bot_front
```

2. Instala las dependencias:

```bash
npm install
```

3. Ejecuta la aplicación en modo desarrollo:

```bash
npm run dev
```

La app estará disponible en `http://localhost:5173` o en el puerto que Vite determine.

---

## ⚙️ Comandos disponibles

| Comando           | Descripción                                  |
|-------------------|----------------------------------------------|
| `npm run dev`     | Inicia la app en modo desarrollo              |
| `npm run build`   | Construye la app para producción              |
| `npm run preview` | Previsualiza la app construida                |
| `npm run lint`    | Analiza el código con ESLint                  |
| `npm run start`   | Inicia el servidor en `0.0.0.0:3000`          |

---

## 🌍 Idiomas soportados

- 🇪🇸 Español (ES)
- 🇬🇧 Inglés (EN)
- 🇵🇹 Portugués (PT)

Se detecta automáticamente el idioma del navegador, con opción de cambiarlo manualmente desde el selector.

---

## 🎨 Temas

La app soporta modo claro 🌞 y oscuro 🌙. Puedes alternarlo fácilmente con el botón de tema en la navegación.

---

## 🔐 Autenticación

La autenticación se realiza por número de teléfono y contraseña.  
Una vez logueado, el usuario puede ver y administrar sus suscripciones personalizadas.

---

## 🚀 Producción y Backend

Este frontend se comunica con una API REST desarrollada con Express, Sequelize y SQLite, alojada en contenedores en **Digital Ocean**.

- 🔗 [Repositorio Backend](https://github.com/fom78/news_bot_back)
- 🏠 [App en Producción](https://octopus-app-lf5vn.ondigitalocean.app/)

---

## 👨‍💼 Autor

Proyecto de práctica desarrollado por **Fernando Masino** ([@fom78](https://github.com/fom78)).  
Este frontend es parte de una aplicación modular con backend desacoplado y soporte para múltiples tecnologías.

