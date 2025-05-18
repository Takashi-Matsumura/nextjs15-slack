#########################
# Builder stage
#########################
FROM node:18-alpine AS builder
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm ci

# Copy source
COPY . .
# Generate Prisma client
RUN npx prisma generate
# Build Next.js
RUN npm run build

#########################
# Production stage
#########################
FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copy package.json and node_modules from builder
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
# Copy build output and public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

EXPOSE 3000

# Start the Next.js production server
CMD ["npm", "run", "start"]
