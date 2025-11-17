# ReviewRescue 🛟

**Prevent negative reviews by redirecting unhappy customers to a private feedback form on your website, while sending satisfied customers to your Google Review page.**

Improve your online reputation and address concerns directly before they reach public platforms.

---

## 🌟 Features

- **Smart Sentiment Routing**: Customers select their experience (😊 Happy, 😐 Neutral, 😞 Sad)
- **Happy Customers** → Redirected to public review platforms (Google, Trust Pilot, Facebook, etc.)
- **Neutral/Unhappy Customers** → Private feedback form sent directly to business owner
- **Multi-Platform Support**: Configure up to 3 review platforms with custom weighting
- **Weighted Distribution**: Control how reviews are distributed across platforms (e.g., 50% Google, 25% Trust Pilot, 25% Facebook)
- **Email Templates**: Pre-built email templates with clickable emoji buttons
- **Subdomain Support**: Host review pages on custom subdomains (e.g., `johns-cafe.brighterwebsites.com.au`)
- **Path-Based URLs**: Also supports path-based routing (e.g., `brighterwebsites.com.au/review/johns-cafe`)
- **Admin Dashboard**: Manage businesses, configure platforms, and view feedback
- **Email Notifications**: Business owners receive instant notifications for private feedback

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database (or SQLite for development)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/brighterwebsites/ReviewRescue.git
   cd ReviewRescue
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your configuration:
   ```env
   # Database (SQLite for development, PostgreSQL for production)
   DATABASE_URL="file:./dev.db"
   # Or for PostgreSQL:
   # DATABASE_URL="postgresql://user:password@localhost:5432/reviewrescue"

   # Email Configuration (optional for feedback notifications)
   SMTP_HOST="smtp.gmail.com"
   SMTP_PORT="587"
   SMTP_USER="your-email@gmail.com"
   SMTP_PASSWORD="your-app-password"
   SMTP_FROM="ReviewRescue <noreply@brighterwebsites.com.au>"

   # App Configuration
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   NEXT_PUBLIC_BASE_DOMAIN="localhost:3000"
   ```

4. **Set up the database**
   ```bash
   npm run db:push
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 📖 How It Works

### 1. Business Setup

1. Go to `/admin` to access the admin dashboard
2. Click "Add New Business"
3. Enter business details (name, slug, owner email)
4. Configure up to 3 review platforms with URLs and weights

### 2. Review Link Distribution

**Option A: Path-Based URL**
```
https://brighterwebsites.com.au/review/johns-cafe
```

**Option B: Subdomain (requires DNS configuration)**
```
https://johns-cafe.brighterwebsites.com.au
```

### 3. Customer Flow

```
Customer clicks review link
         ↓
Sentiment selection page
   (😊 😐 😞)
         ↓
    ┌────┴────┐
    ↓         ↓
  Happy    Neutral/Sad
    ↓         ↓
Review    Feedback
Platform    Form
```

**Happy Path:**
- Customer is redirected to a review platform
- Platform selection uses configured weighting:
  - 100% → Always goes to that platform
  - 50%/25%/25% → Distributes in round-robin pattern
  - 33%/33%/33% → Cycles through all platforms

**Neutral/Sad Path:**
- Customer fills out private feedback form
- Business owner receives email notification
- Feedback visible in admin dashboard
- Business can address concerns directly

### 4. Platform Weighting Examples

**Example 1: Single Platform**
```
Google Reviews: 100%
Trust Pilot: 0%
Facebook: 0%
→ All happy customers go to Google
```

**Example 2: Two Platforms**
```
Google Reviews: 70%
Trust Pilot: 30%
Facebook: 0%
→ 7/10 customers to Google, 3/10 to Trust Pilot
```

**Example 3: Three Platforms**
```
Google Reviews: 50%
Trust Pilot: 25%
Facebook: 25%
→ Round-robin: Google, Google, Trust Pilot, Facebook, repeat
```

---

## 🎨 Email Template

Send review requests to customers using the built-in email template:

1. Go to `/admin/business/{id}` for your business
2. Scroll to "Email Template" section
3. Click "Copy Email HTML"
4. Use in your email campaign software (Mailchimp, SendGrid, etc.)

The email includes clickable emoji buttons that link directly to your review page.

---

## 🏗️ Project Structure

```
ReviewRescue/
├── app/
│   ├── page.tsx                    # Home page
│   ├── admin/                      # Admin dashboard
│   │   ├── page.tsx               # Business list
│   │   ├── new/                   # Add new business
│   │   └── business/[id]/         # Business settings
│   ├── review/[slug]/             # Sentiment selection page
│   ├── feedback/[slug]/           # Feedback form
│   └── api/
│       └── feedback/              # API for feedback submission
├── components/
│   ├── SentimentSelector.tsx      # Emoji selection UI
│   ├── FeedbackForm.tsx           # Private feedback form
│   └── BusinessSettings.tsx       # Admin settings UI
├── lib/
│   ├── db.ts                      # Database functions
│   ├── review-distribution.ts     # Weighting logic
│   └── email.ts                   # Email templates & sending
├── types/
│   └── index.ts                   # TypeScript types
├── prisma/
│   └── schema.prisma              # Database schema
└── middleware.ts                  # Subdomain routing
```

---

## 🗄️ Database Schema

```prisma
model Business {
  id                String           @id @default(cuid())
  name              String
  slug              String           @unique
  email             String
  platforms         ReviewPlatform[]
  feedbacks         Feedback[]
  lastPlatformIndex Int              @default(0)
}

model ReviewPlatform {
  id         String   @id @default(cuid())
  businessId String
  name       String
  url        String
  weight     Int      @default(100)
  order      Int      @default(0)
}

model Feedback {
  id         String   @id @default(cuid())
  businessId String
  name       String
  email      String
  message    String
  rating     String   // "neutral" or "sad"
  read       Boolean  @default(false)
  createdAt  DateTime @default(now())
}
```

---

## 🌐 Subdomain Setup

### Development

Add to `/etc/hosts` (or `C:\Windows\System32\drivers\etc\hosts` on Windows):
```
127.0.0.1 johns-cafe.localhost
127.0.0.1 another-business.localhost
```

### Production

1. **Wildcard DNS Record**
   Create a wildcard A record in your DNS:
   ```
   *.brighterwebsites.com.au → Your server IP
   ```

2. **Update .env**
   ```env
   NEXT_PUBLIC_BASE_DOMAIN="brighterwebsites.com.au"
   NEXT_PUBLIC_APP_URL="https://brighterwebsites.com.au"
   ```

3. **SSL Certificate**
   Use a wildcard SSL certificate for `*.brighterwebsites.com.au`

---

## 🚢 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy
5. Configure custom domain with wildcard subdomain support

### Docker

```bash
# Build
docker build -t reviewrescue .

# Run
docker run -p 3000:3000 --env-file .env reviewrescue
```

---

## 🛠️ Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

npm run db:push      # Push schema changes to database
npm run db:studio    # Open Prisma Studio
npm run db:generate  # Generate Prisma Client
```

### Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Prisma ORM (PostgreSQL/SQLite)
- **Email**: Nodemailer
- **Deployment**: Vercel

---

## 📧 Email Configuration

### Gmail Setup

1. Enable 2-factor authentication on your Google account
2. Generate an App Password: [https://myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
3. Use the app password in your `.env` file

### Other SMTP Providers

ReviewRescue works with any SMTP provider:
- SendGrid
- Mailgun
- Amazon SES
- Custom SMTP server

---

## 🔒 Security

- Input validation on all forms
- SQL injection prevention via Prisma ORM
- XSS protection with React's built-in escaping
- CSRF protection on server actions
- Environment variables for sensitive data
- Email rate limiting (recommended for production)

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

MIT License - See [LICENSE](LICENSE) file for details

---

## 🙏 Credits

Developed by **Brighter Websites**
Website: [https://brighterwebsites.com.au](https://brighterwebsites.com.au)

---

## 📞 Support

- **Documentation**: This README
- **Issues**: [GitHub Issues](https://github.com/brighterwebsites/ReviewRescue/issues)
- **Email**: support@brighterwebsites.com.au

---

## 🗺️ Roadmap

- [ ] Business owner authentication
- [ ] Dashboard analytics (feedback trends, response rates)
- [ ] Custom branding/theming per business
- [ ] SMS notifications for feedback
- [ ] Multi-language support
- [ ] Integration with popular CRM systems
- [ ] Automated follow-up emails
- [ ] Mobile app for business owners
- [ ] Advanced sentiment analysis
- [ ] Webhook support for third-party integrations

---

## ⚡ Performance Tips

1. **Enable caching** for review page renders
2. **Use CDN** for static assets
3. **Optimize images** in email templates
4. **Database indexing** on businessId and createdAt fields
5. **Connection pooling** for database connections

---

Made with ❤️ by Brighter Websites
