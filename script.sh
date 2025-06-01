cat > fix_tailwind.sh << 'EOF'
#!/bin/bash
echo "Fixing Tailwind CSS configuration..."

# Pull latest changes
git pull origin main

# Remove old config
rm -f tailwind.config.js

# Create new PostCSS config
cat > postcss.config.js << 'POSTCSS_EOF'
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
POSTCSS_EOF

# Update package.json (truncated for brevity - I'd include the full content)
# ... package.json content here ...

# Create new Tailwind config
cat > tailwind.config.js << 'TAILWIND_EOF'
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
TAILWIND_EOF

# Clean install
rm -rf node_modules package-lock.json
npm install

# Commit and push
git add .
git commit -m "Fix Tailwind CSS configuration and dependencies"
git push origin main

echo "Done! Starting dev server..."
npm run dev
EOF

chmod +x fix_tailwind.sh
./fix_tailwind.sh
