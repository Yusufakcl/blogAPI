
# Blog API

[![Lisans: ISC](https://img.shields.io/badge/Lisans-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-24.0.0-green?logo=node.js)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-5.1.0-orange?logo=express)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-8.16.2-green?logo=mongodb)](https://www.mongodb.com/)
[![Prettier](https://img.shields.io/badge/code_style-Prettier-ff69b4.svg)](https://prettier.io/)

Bu proje, kullanıcıların blog gönderileri oluşturmasına, görüntülemesine, beğenmesine ve yorum yapmasına olanak tanıyan tam donanımlı bir RESTful API sunar. Modern teknolojiler kullanılarak güvenli, ölçeklenebilir ve sağlam bir backend altyapısı hedeflenmiştir.

## ✨ Özellikler

- **Kullanıcı Yönetimi**: Kayıt olma, giriş yapma, profil güncelleme ve kullanıcı silme işlemleri.
- **Kimlik Doğrulama**: JWT (JSON Web Tokens) tabanlı güvenli kimlik doğrulama ve token yenileme mekanizması.
- **Yetkilendirme**: Rol tabanlı (`admin`, `user`) erişim kontrolü.
- **Blog Yönetimi (CRUD)**: Blog gönderileri oluşturma, okuma, güncelleme ve silme.
- **Yorum Sistemi**: Blog gönderilerine yorum yapma, yorumları listeleme ve silme.
- **Beğeni Sistemi**: Blog gönderilerini beğenme ve beğeniyi geri çekme.
- **Dosya Yükleme**: Blog banner'ları için [Cloudinary](https://cloudinary.com/) entegrasyonu.
- **Güvenlik**: `helmet`, `cors`, `express-rate-limit` ve `dompurify` ile güvenlik önlemleri.
- **Validasyon**: `express-validator` ile gelen isteklerin detaylı doğrulaması.
- **Sayfalama**: Listeleme endpoint'lerinde `limit` ve `offset` ile sayfalama desteği.
- **Logging**: `winston` ile loglama altyapısı.

## 🛠️ Kullanılan Teknolojiler

- **Backend**: Node.js, Express.js, TypeScript
- **Veritabanı**: MongoDB, Mongoose ODM
- **Kimlik Doğrulama**: JSON Web Token (JWT), bcrypt
- **Dosya Yükleme**: Cloudinary, Multer
- **Güvenlik**: Helmet, CORS, Express Rate Limit, DOMPurify
- **Geliştirme Araçları**: Nodemon, Prettier, ts-node

## 🚀 Projeyi Başlatma

Projeyi yerel makinenizde çalıştırmak için aşağıdaki adımları izleyin.

### Gereksinimler

- [Node.js](https://nodejs.org/) (v24.0.0 veya üzeri)
- [MongoDB](https://www.mongodb.com/try/download/community)
- [Postman](https://www.postman.com/downloads/) (API testleri için)

### Kurulum

1. Projeyi klonlayın:
   ```sh
   git clone https://github.com/Yusufakcl/blogApi.git
   ```
2. Proje dizinine gidin:
   ```sh
   cd blogApi
   ```
3. Gerekli paketleri yükleyin:
   ```sh
   npm install
   ```
4. Proje ana dizininde `.env` adında bir dosya oluşturun ve aşağıdaki ortam değişkenlerini kendi yapılandırmanıza göre doldurun.
   ```env
   # Sunucu Portu
   PORT=3000

   # Veritabanı
   MONGODB_URI=mongodb://localhost:27017/blogApi

   # JWT Ayarları
   JWT_ACCESS_SECRET=your_jwt_access_secret
   JWT_REFRESH_SECRET=your_jwt_refresh_secret
   JWT_ACCESS_EXPIRES_IN=15m
   JWT_REFRESH_EXPIRES_IN=7d

   # Cloudinary (Blog banner'ları için)
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```
5. Uygulamayı geliştirme modunda başlatın:
   ```sh
   npm run dev
   ```
Uygulama artık `http://localhost:3000` adresinde çalışıyor olacak.

## API Endpointleri

Tüm endpoint'ler `/api/v1` ön eki ile başlar. Postman gibi bir araç kullanarak istek atabilirsiniz.

- `Authorization: Bearer <accessToken>` başlığı, kimlik doğrulama gerektiren endpoint'ler için zorunludur.

---

### 🔑 Auth

| Method | Endpoint          | Yetki  | Açıklama                                    |
| :----- | :---------------- | :----- | :------------------------------------------ |
| `POST` | `/auth/register`  | Herkes | Yeni bir kullanıcı hesabı oluşturur.          |
| `POST` | `/auth/login`     | Herkes | Kullanıcı girişi yapar ve token'lar döndürür. |
| `POST` | `/auth/refresh-token` | Herkes | `refreshToken` kullanarak yeni bir `accessToken` alır. |
| `POST` | `/auth/logout`    | `user`, `admin` | Kullanıcı çıkışı yapar (token'ı geçersiz kılar). |

---

### 👤 User

| Method   | Endpoint           | Yetki       | Açıklama                                       |
| :------- | :----------------- | :---------- | :--------------------------------------------- |
| `GET`    | `/users/current`   | `user`, `admin` | Giriş yapmış olan kullanıcının bilgilerini döndürür. |
| `PUT`    | `/users/current`   | `user`, `admin` | Giriş yapmış olan kullanıcının bilgilerini günceller. |
| `DELETE` | `/users/current`   | `user`, `admin` | Giriş yapmış olan kullanıcıyı siler.            |
| `GET`    | `/users`           | `admin`     | Tüm kullanıcıları listeler.                       |
| `GET`    | `/users/:userId`   | `admin`     | Belirtilen ID'ye sahip kullanıcıyı getirir.    |
| `DELETE` | `/users/:userId`   | `admin`     | Belirtilen ID'ye sahip kullanıcıyı siler.      |

---

### 📝 Blog

| Method   | Endpoint              | Yetki       | Açıklama                                                           |
| :------- | :-------------------- | :---------- | :----------------------------------------------------------------- |
| `POST`   | `/blogs`              | `admin`     | Yeni bir blog gönderisi oluşturur. (`form-data` ile banner yüklenebilir) |
| `GET`    | `/blogs`              | `user`, `admin` | Tüm blog gönderilerini listeler.                                    |
| `GET`    | `/blogs/user/:userId` | `user`, `admin` | Belirli bir kullanıcının tüm blog gönderilerini listeler.          |
| `GET`    | `/blogs/:slug`        | `user`, `admin` | Belirtilen `slug`'a sahip blog gönderisini getirir.                 |
| `PUT`    | `/blogs/:blogId`      | `admin`     | Belirtilen `blogId`'ye sahip gönderiyi günceller.                  |
| `DELETE` | `/blogs/:blogId`      | `admin`     | Belirtilen `blogId`'ye sahip gönderiyi siler.                      |

---

### 💬 Comment

| Method   | Endpoint                | Yetki       | Açıklama                                                |
| :------- | :---------------------- | :---------- | :------------------------------------------------------ |
| `POST`   | `/comments/blog/:blogId` | `user`, `admin` | Bir blog gönderisine yeni bir yorum ekler.              |
| `GET`    | `/comments/blog/:blogId` | `user`, `admin` | Bir blog gönderisinin tüm yorumlarını listeler.         |
| `DELETE` | `/comments/:commentId`   | `user`, `admin` | Belirtilen `commentId`'ye sahip yorumu siler. (Kullanıcı kendi yorumunu veya admin herhangi bir yorumu silebilir) |

---

### ❤️ Like

| Method   | Endpoint           | Yetki       | Açıklama                               |
| :------- | :----------------- | :---------- | :------------------------------------- |
| `POST`   | `/likes/blog/:blogId`  | `user`, `admin` | Bir blog gönderisini beğenir.            |
| `DELETE` | `/likes/blog/:blogId`  | `user`, `admin` | Bir blog gönderisindeki beğeniyi geri çeker. |

## 🤝 Katkıda Bulunma

Katkılarınız projeyi daha iyi bir hale getirmemize yardımcı olur! Lütfen forklayın, değişikliklerinizi yapın ve bir Pull Request oluşturun. Git versiyon kontrol sistemini aktif olarak kullanıyoruz ve tüm değişiklikler commit'ler ile takip edilmektedir. 