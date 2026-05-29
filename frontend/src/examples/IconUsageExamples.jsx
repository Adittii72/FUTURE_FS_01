import React from 'react';
// Import icons from different libraries
import { 
  FaHome, FaUser, FaEnvelope, FaPhone, FaGithub, FaLinkedin,
  FaHeart, FaStar, FaDownload, FaEdit, FaTrash, FaCog 
} from 'react-icons/fa';
import { MdEmail, MdSettings, MdNotifications } from 'react-icons/md';
import { HiHome, HiUser, HiMail } from 'react-icons/hi2';
import { BsGithub, BsLinkedin, BsTwitter } from 'react-icons/bs';
import { FiMail, FiPhone, FiSettings } from 'react-icons/fi';

/**
 * Icon Usage Examples
 * 
 * This file demonstrates various ways to use react-icons in your project
 */

const IconUsageExamples = () => {
  return (
    <div className="p-8 space-y-12 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <h1 className="text-4xl font-bold gradient-text">React Icons Usage Examples</h1>

      {/* Example 1: Basic Usage */}
      <section className="glass-card p-6">
        <h2 className="text-2xl font-bold mb-4">1. Basic Usage</h2>
        <div className="flex gap-4 items-center">
          <FaHome />
          <FaUser />
          <FaEnvelope />
          <FaPhone />
        </div>
        <pre className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded text-sm overflow-x-auto">
{`import { FaHome, FaUser, FaEnvelope, FaPhone } from 'react-icons/fa';

<FaHome />
<FaUser />
<FaEnvelope />
<FaPhone />`}
        </pre>
      </section>

      {/* Example 2: Custom Size */}
      <section className="glass-card p-6">
        <h2 className="text-2xl font-bold mb-4">2. Custom Size</h2>
        <div className="flex gap-4 items-center">
          <FaHome size={16} />
          <FaHome size={24} />
          <FaHome size={32} />
          <FaHome size={48} />
          <FaHome size={64} />
        </div>
        <pre className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded text-sm overflow-x-auto">
{`<FaHome size={16} />
<FaHome size={24} />
<FaHome size={32} />
<FaHome size={48} />
<FaHome size={64} />`}
        </pre>
      </section>

      {/* Example 3: Custom Color */}
      <section className="glass-card p-6">
        <h2 className="text-2xl font-bold mb-4">3. Custom Color</h2>
        <div className="flex gap-4 items-center">
          <FaHeart size={32} color="red" />
          <FaStar size={32} color="gold" />
          <FaHome size={32} color="#3B82F6" />
          <FaUser size={32} color="purple" />
        </div>
        <pre className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded text-sm overflow-x-auto">
{`<FaHeart size={32} color="red" />
<FaStar size={32} color="gold" />
<FaHome size={32} color="#3B82F6" />
<FaUser size={32} color="purple" />`}
        </pre>
      </section>

      {/* Example 4: With Tailwind Classes */}
      <section className="glass-card p-6">
        <h2 className="text-2xl font-bold mb-4">4. With Tailwind CSS Classes</h2>
        <div className="flex gap-4 items-center">
          <FaHome className="w-8 h-8 text-blue-500" />
          <FaUser className="w-8 h-8 text-green-500" />
          <FaEnvelope className="w-8 h-8 text-red-500" />
          <FaPhone className="w-8 h-8 text-purple-500" />
        </div>
        <pre className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded text-sm overflow-x-auto">
{`<FaHome className="w-8 h-8 text-blue-500" />
<FaUser className="w-8 h-8 text-green-500" />
<FaEnvelope className="w-8 h-8 text-red-500" />
<FaPhone className="w-8 h-8 text-purple-500" />`}
        </pre>
      </section>

      {/* Example 5: Hover Effects */}
      <section className="glass-card p-6">
        <h2 className="text-2xl font-bold mb-4">5. Hover Effects</h2>
        <div className="flex gap-4 items-center">
          <FaHome className="w-8 h-8 text-gray-500 hover:text-blue-500 transition-colors cursor-pointer" />
          <FaUser className="w-8 h-8 text-gray-500 hover:text-green-500 hover:scale-110 transition-all cursor-pointer" />
          <FaEnvelope className="w-8 h-8 text-gray-500 hover:text-red-500 hover:rotate-12 transition-all cursor-pointer" />
        </div>
        <pre className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded text-sm overflow-x-auto">
{`<FaHome className="hover:text-blue-500 transition-colors" />
<FaUser className="hover:scale-110 transition-all" />
<FaEnvelope className="hover:rotate-12 transition-all" />`}
        </pre>
      </section>

      {/* Example 6: In Buttons */}
      <section className="glass-card p-6">
        <h2 className="text-2xl font-bold mb-4">6. Icons in Buttons</h2>
        <div className="flex flex-wrap gap-4">
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
            <FaDownload />
            <span>Download</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
            <FaEdit />
            <span>Edit</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
            <FaTrash />
            <span>Delete</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600">
            <FaCog />
            <span>Settings</span>
          </button>
        </div>
        <pre className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded text-sm overflow-x-auto">
{`<button className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg">
  <FaDownload />
  <span>Download</span>
</button>`}
        </pre>
      </section>

      {/* Example 7: Social Media Icons */}
      <section className="glass-card p-6">
        <h2 className="text-2xl font-bold mb-4">7. Social Media Icons</h2>
        <div className="flex gap-4 items-center">
          <a href="#" className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors">
            <FaLinkedin size={24} />
          </a>
          <a href="#" className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-800 text-white hover:bg-gray-900 transition-colors">
            <FaGithub size={24} />
          </a>
          <a href="#" className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-400 text-white hover:bg-blue-500 transition-colors">
            <BsTwitter size={24} />
          </a>
        </div>
        <pre className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded text-sm overflow-x-auto">
{`<a href="#" className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-600 text-white">
  <FaLinkedin size={24} />
</a>`}
        </pre>
      </section>

      {/* Example 8: Different Icon Libraries */}
      <section className="glass-card p-6">
        <h2 className="text-2xl font-bold mb-4">8. Different Icon Libraries</h2>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <span className="w-32 font-medium">Font Awesome:</span>
            <FaHome size={24} />
            <FaUser size={24} />
            <FaEnvelope size={24} />
          </div>
          <div className="flex items-center gap-4">
            <span className="w-32 font-medium">Material Design:</span>
            <MdEmail size={24} />
            <MdSettings size={24} />
            <MdNotifications size={24} />
          </div>
          <div className="flex items-center gap-4">
            <span className="w-32 font-medium">Heroicons:</span>
            <HiHome size={24} />
            <HiUser size={24} />
            <HiMail size={24} />
          </div>
          <div className="flex items-center gap-4">
            <span className="w-32 font-medium">Bootstrap:</span>
            <BsGithub size={24} />
            <BsLinkedin size={24} />
            <BsTwitter size={24} />
          </div>
          <div className="flex items-center gap-4">
            <span className="w-32 font-medium">Feather:</span>
            <FiMail size={24} />
            <FiPhone size={24} />
            <FiSettings size={24} />
          </div>
        </div>
        <pre className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded text-sm overflow-x-auto">
{`import { FaHome } from 'react-icons/fa';        // Font Awesome
import { MdEmail } from 'react-icons/md';        // Material Design
import { HiHome } from 'react-icons/hi2';        // Heroicons
import { BsGithub } from 'react-icons/bs';       // Bootstrap
import { FiMail } from 'react-icons/fi';         // Feather`}
        </pre>
      </section>

      {/* Example 9: Icon with Badge */}
      <section className="glass-card p-6">
        <h2 className="text-2xl font-bold mb-4">9. Icon with Badge (Notification)</h2>
        <div className="flex gap-8 items-center">
          <div className="relative">
            <MdNotifications size={32} className="text-gray-700 dark:text-gray-300" />
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              3
            </span>
          </div>
          <div className="relative">
            <FaEnvelope size={32} className="text-gray-700 dark:text-gray-300" />
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center">
              5
            </span>
          </div>
        </div>
        <pre className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded text-sm overflow-x-auto">
{`<div className="relative">
  <MdNotifications size={32} />
  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
    3
  </span>
</div>`}
        </pre>
      </section>

      {/* Example 10: Animated Icons */}
      <section className="glass-card p-6">
        <h2 className="text-2xl font-bold mb-4">10. Animated Icons</h2>
        <div className="flex gap-8 items-center">
          <FaCog size={32} className="text-blue-500 animate-spin" />
          <FaHeart size={32} className="text-red-500 animate-pulse" />
          <FaStar size={32} className="text-yellow-500 animate-bounce" />
        </div>
        <pre className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded text-sm overflow-x-auto">
{`<FaCog className="animate-spin" />      // Spinning
<FaHeart className="animate-pulse" />    // Pulsing
<FaStar className="animate-bounce" />    // Bouncing`}
        </pre>
      </section>

      {/* Resources */}
      <section className="glass-card p-6">
        <h2 className="text-2xl font-bold mb-4">Resources</h2>
        <div className="space-y-2">
          <a
            href="https://react-icons.github.io/react-icons/"
            target="_blank"
            rel="noopener noreferrer"
            className="block text-primary hover:underline"
          >
            → Official React Icons Documentation
          </a>
          <a
            href="https://react-icons.github.io/react-icons/search"
            target="_blank"
            rel="noopener noreferrer"
            className="block text-primary hover:underline"
          >
            → Search All Available Icons
          </a>
          <p className="text-gray-600 dark:text-gray-400 mt-4">
            Check <code className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">frontend/src/utils/iconReference.js</code> for more information
          </p>
        </div>
      </section>
    </div>
  );
};

export default IconUsageExamples;
