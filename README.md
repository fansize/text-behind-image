# Text Behind Image
A powerful web application that creates stunning text-behind-image effects using AI-powered background removal. Built with Next.js.

![og-image.png](public/og-image.png)

## ✨ Features
- AI Background Removal : Automatically remove backgrounds from images using advanced AI technology
- Text Overlay Editor : Add and customize text layers with full control over:
  - Font family and size
  - Colors and opacity
  - Text shadows and rotation
  - Position and layering
- Real-time Preview : See your changes instantly as you edit
- Multiple Text Layers : Add, duplicate, and manage multiple text elements
- High-Quality Export : Download your creations in high resolution
- Template Gallery : Choose from pre-designed templates to get started quickly

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- pnpm (recommended) or npm
- Supabase account for authentication
- Stripe account for payments (optional)

### Installation
1.  Clone the repository:

```
git clone https://github.com/fansize/text-behind-image.git
cd text-behind-image
```

2.  Install dependencies:

```
pnpm install
```
3.  Set up environment variables:

Create a .env.local file with your Supabase and Stripe credentials.

4.  Run the development server:

```
pnpm dev
```
Open http://localhost:3000 to view the application.

## 🛠️ Tech Stack
- Framework : Next.js
- Styling : Tailwind CSS + shadcn/ui components
- Authentication : Supabase Auth
- Database : Supabase
- Payments : Stripe
- AI Processing : @imgly/background-removal
- Animations : Framer Motion


## 📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.