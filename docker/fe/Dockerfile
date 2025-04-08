FROM node:18-alpine

WORKDIR /app

# Cài đặt tzdata để hỗ trợ timezone
RUN apk add --no-cache tzdata

# Cấu hình timezone
ENV TZ=Asia/Ho_Chi_Minh

RUN npm install -g serve

# Copy the build files
COPY ./frontend/build /app/build
COPY ./frontend/public /app/public

# Expose port 5173
EXPOSE 5173

# Run the app with serve
CMD ["serve", "-s", "build", "-l", "5173"]
