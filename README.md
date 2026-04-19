# 360 Memories Landing Page

Static, Netlify-ready lead capture site for **360 Memories**. The build is optimized for quick demo delivery now and a clean path to production deployment later with Netlify Forms and SMS alerts.

## File Structure

```text
.
|-- assets/
|   |-- social-share.png
|   `-- logo.png
|-- netlify/
|   `-- functions/
|       `-- send-lead-sms.js
|-- config.js
|-- index.html
|-- main.js
|-- netlify.toml
|-- README.md
|-- styles.css
`-- thank-you.html
```

## Local Review

Open [index.html](/Users/randyurizar/Documents/projects-master/360memories/index.html) in a browser for a quick visual review.

For a simple local server:

```bash
python3 -m http.server 8080
```

Then visit `http://localhost:8080`.

## How To Update Content

Most client-specific details live in [config.js](/Users/randyurizar/Documents/projects-master/360memories/config.js).

Update these values there:

- `businessName`
- `ownerName`
- `phoneNumber`
- `phoneDisplay`
- `email`
- `serviceArea`
- `instagram`
- `instagramUrl`
- `defaultLanguage`
- `translations.es`
- `translations.en`

Use the translation objects to change:

- headlines
- buttons
- package labels
- FAQ copy
- form labels
- thank-you messaging

The site now uses [assets/logo.png](/Users/randyurizar/Documents/projects-master/360memories/assets/logo.png) as the single active brand logo. If you want to swap it later, replace that file directly or update the `src` values in [index.html](/Users/randyurizar/Documents/projects-master/360memories/index.html) and [thank-you.html](/Users/randyurizar/Documents/projects-master/360memories/thank-you.html).

The social share preview image is [assets/social-share.png](/Users/randyurizar/Documents/projects-master/360memories/assets/social-share.png) and is referenced by the Open Graph and Twitter meta tags in [index.html](/Users/randyurizar/Documents/projects-master/360memories/index.html).

## Netlify Deployment

1. Push this folder to GitHub.
2. Create a new site in Netlify from that repository.
3. Netlify will publish the project root using [netlify.toml](/Users/randyurizar/Documents/projects-master/360memories/netlify.toml).
4. Form submissions will appear in the Netlify Forms dashboard once the site is deployed and the form is detected.

Important details already included in the main form:

- `name="lead-capture-360-memories"`
- `method="POST"`
- `data-netlify="true"`
- hidden `form-name` input
- honeypot field for spam reduction
- `action="/thank-you.html"` redirect after submit

## Connecting The Domain Later

Since the client already has a WordPress domain, you can point the domain to Netlify later:

1. Deploy this site to Netlify first.
2. In Netlify, open `Domain management`.
3. Add the custom domain.
4. Update the DNS records where the current domain is managed.
5. Once DNS propagates, enable HTTPS in Netlify if it is not already active.

## Future SMS Alert Hook

The placeholder function lives at [netlify/functions/send-lead-sms.js](/Users/randyurizar/Documents/projects-master/360memories/netlify/functions/send-lead-sms.js).

Recommended future production flow:

1. Netlify form submission is created.
2. A Netlify submission webhook or server-side workflow sends the lead payload to `/netlify/functions/send-lead-sms`.
3. That function formats the lead details and sends an SMS through Twilio.
4. Netlify Forms remains the backup record of every lead.

When Twilio is added later, this function is the right place to:

- validate payload fields
- normalize phone numbers
- compose the SMS message
- send alerts to the owner
- optionally send auto-replies

## Notes

- The site is static and framework-free for easy cloning and reuse.
- Content is bilingual and driven by a centralized translation object.
- The visual gallery is placeholder-friendly so real event photos can be dropped in later without redesigning the page.
