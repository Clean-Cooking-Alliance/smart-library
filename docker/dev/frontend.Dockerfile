FROM node:18-alpine

WORKDIR /app

COPY package.json package-lock.json ./
# Install all dependencies including dev dependencies
RUN npm install \
    @tanstack/react-query \
    @radix-ui/react-icons \
    axios \
    react-router-dom \
    @clerk/clerk-react \
    class-variance-authority \
    clsx \
    lucide-react \
    tailwindcss-animate \
    tailwindcss \
    postcss \
    autoprefixer \
    @radix-ui/react-slot \
    @radix-ui/react-tabs \
    class-variance-authority \
    tailwind-merge \
    @types/node \
    @types/react \
    @types/react-dom \
    typescript \
    react-simple-maps \
    xlsx \
    @xyflow/react \
    react-tooltip \
    js-cookie

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 5173

# Start the app
CMD ["npm", "run", "dev"]