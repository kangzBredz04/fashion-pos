// src/components/Footer.js
export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center px-4 space-y-6 md:space-y-0">
        {/* Left Section: Brand & Copyright */}
        <div className="text-center md:text-left">
          <h2 className="text-2xl font-bold">Fashion POS</h2>
          <p className="text-gray-400 mt-2">
            &copy; 2024 Fashion. All rights reserved.
          </p>
        </div>

        {/* Center Section: Quick Links */}
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">Quick Links</h3>
          <ul className="flex space-x-4">
            <li>
              <a href="/dashboard" className="hover:text-gray-300">
                Dashboard
              </a>
            </li>
            <li>
              <a href="/products" className="hover:text-gray-300">
                Products
              </a>
            </li>
            <li>
              <a href="/orders" className="hover:text-gray-300">
                Orders
              </a>
            </li>
            <li>
              <a href="/customers" className="hover:text-gray-300">
                Customers
              </a>
            </li>
          </ul>
        </div>

        {/* Right Section: Social Media Links */}
        <div className="text-center md:text-right">
          <h3 className="text-lg font-semibold mb-2">Connect with Us</h3>
          <div className="flex space-x-4 justify-center md:justify-end">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-300"
            >
              <i className="fab fa-facebook-f"></i> Facebook
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-300"
            >
              <i className="fab fa-instagram"></i> Instagram
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-300"
            >
              <i className="fab fa-twitter"></i> Twitter
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
