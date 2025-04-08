# Sử dụng Node.js image làm base
FROM node:18-alpine

# Cài đặt expo-cli toàn cục
RUN npm install -g expo-cli

# Tạo thư mục cho ứng dụng
WORKDIR /mobile

# Sao chép package.json và package-lock.json vào container
COPY package*.json ./

# Cài đặt các dependencies
RUN npm install

# Sao chép toàn bộ mã nguồn vào container
COPY . .

# Expose cổng mà Expo sẽ chạy trên đó
EXPOSE 8081

# Chạy Expo để phát triển
CMD ["expo", "start", "--tunnel"]
