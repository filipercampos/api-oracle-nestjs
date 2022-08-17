# Middleware
Middleware is called only before the route handler is called. You have access to the response object, but you don't have the result of the route handler. They are basically express middleware functions.

# Helmet
Helmet can help protect your app from some well-known web vulnerabilities by setting HTTP headers appropriately. Generally, Helmet is just a collection of 14 smaller middleware functions that set security-related HTTP headers (read more).

# CORS
Cross-origin resource sharing (CORS) is a mechanism that allows resources to be requested from another domain. Under the hood, Nest makes use of the Express cors package. This package provides various options that you can customize based on your requirements.

# CSRF Protection
Cross-site request forgery (also known as CSRF or XSRF) is a type of malicious exploit of a website where unauthorized commands are transmitted from a user that the web application trusts. To mitigate this kind of attack you can use the csurf package.



