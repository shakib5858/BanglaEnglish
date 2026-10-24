TrackZone GPS Store — HTML/CSS/JS starter

Files:
- index.html: storefront
- style.css: responsive/mobile app-like design
- script.js: demo products, category filter, search, cart, WhatsApp checkout, product admin form

How to use:
1. Extract the ZIP.
2. Open index.html in a browser, or upload all three files to your hosting public_html folder.
3. In script.js, replace WHATSAPP_NUMBER = "8801XXXXXXXXX" with your WhatsApp number, digits only.
4. To add a product, scroll to Store Management and fill in the form. Use a publicly accessible HTTPS image URL.

Important:
This is a front-end starter. Products added in the admin form are saved in that browser's localStorage only; they are NOT shared with all visitors and can be lost when browser data is cleared. A real public admin panel where products/images are uploaded online for all visitors requires a backend/API and database (for example Next.js + MySQL). Google Fonts and product images load from online URLs and need internet access. Sample product photos are illustrative, not guaranteed to depict exact GPS models.
