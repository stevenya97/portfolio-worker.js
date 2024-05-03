# portfolio-worker.js
Worker script for my portfolio site. Wraps a public notion page with CSS modifications and serves it. Deployed via Cloudflare Workers. Forked from [stephenou/fruitionsite](https://github.com/stephenou/fruitionsite)

Added functionality
- CSS style tweaks(i.e. added border radius for images, removed redundant spacing, align objects)
- Disabled image hover previews
- Block unlisted domains from loading(merge with preview commit)
- Dark mode toggle
- Mobile layout tweaks
- URL slugs

## Usage
If you want to serve your own Notion website, follow steps commented in the script. Steps 1 & 2 will have you edit the domain and urls. Change these your own urls
