# Stage 1: Build React app
FROM node:18-alpine AS build

WORKDIR /app

# Copy chỉ những file cần thiết để cache layer tốt hơn
COPY ./frontend/package*.json ./

# Cài dependencies
RUN npm install

# Copy toàn bộ mã nguồn (sau khi đã cài xong) để tận dụng cache
COPY ./frontend ./

# Build ứng dụng React
RUN npm run build


# Stage 2: Chạy production với serve
FROM node:18-alpine AS production

WORKDIR /app

# Cài tzdata (chỉ khi cần timezone)
RUN apk add --no-cache tzdata && \
    cp /usr/share/zoneinfo/Asia/Ho_Chi_Minh /etc/localtime && \
    echo "Asia/Ho_Chi_Minh" > /etc/timezone

# Cài serve để phục vụ build React
RUN npm install -g serve

# Copy thư mục build từ stage trước
COPY --from=build /app/build ./build

# Expose cổng 5173 (tuỳ thuộc cổng em chọn)
EXPOSE 5173

# Chạy ứng dụng
CMD ["serve", "-s", "build", "-l", "5173"]
