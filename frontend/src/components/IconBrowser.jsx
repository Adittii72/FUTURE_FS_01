import React, { useState } from 'react';
import * as FaIcons from 'react-icons/fa';
import * as MdIcons from 'react-icons/md';
import * as HiIcons from 'react-icons/hi2';
import * as BsIcons from 'react-icons/bs';
import * as FiIcons from 'react-icons/fi';
import * as AiIcons from 'react-icons/ai';

/**
 * Icon Browser Component
 * 
 * A visual tool to browse and copy icon names from react-icons
 * 
 * Usage:
 * import IconBrowser from './components/IconBrowser';
 * 
 * function App() {
 *   return <IconBrowser />;
 * }
 */

const IconBrowser = () => {
  const [selectedLibrary, setSelectedLibrary] = useState('fa');
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedIcon, setCopiedIcon] = useState('');

  const iconLibraries = {
    fa: { name: 'Font Awesome', icons: FaIcons, prefix: 'Fa' },
    md: { name: 'Material Design', icons: MdIcons, prefix: 'Md' },
    hi: { name: 'Heroicons', icons: HiIcons, prefix: 'Hi' },
    bs: { name: 'Bootstrap', icons: BsIcons, prefix: 'Bs' },
    fi: { name: 'Feather', icons: FiIcons, prefix: 'Fi' },
    ai: { name: 'Ant Design', icons: AiIcons, prefix: 'Ai' },
  };

  const currentLibrary = iconLibraries[selectedLibrary];
  const iconNames = Object.keys(currentLibrary.icons).filter(
    (name) => name !== 'IconContext' && name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const copyToClipboard = (iconName) => {
    const importStatement = `import { ${iconName} } from 'react-icons/${selectedLibrary}';`;
    navigator.clipboard.writeText(importStatement);
    setCopiedIcon(iconName);
    setTimeout(() => setCopiedIcon(''), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold gradient-text mb-2">
            React Icons Browser
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Browse and copy icon import statements for your project
          </p>
        </div>

        {/* Controls */}
        <div className="glass-card p-4 sm:p-6 mb-6 space-y-4">
          {/* Library Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Icon Library
            </label>
            <div className="flex flex-wrap gap-2">
              {Object.entries(iconLibraries).map(([key, lib]) => (
                <button
                  key={key}
                  onClick={() => setSelectedLibrary(key)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    selectedLibrary === key
                      ? 'bg-gradient-to-r from-primary to-blue-500 text-white shadow-lg'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  {lib.name}
                </button>
              ))}
            </div>
          </div>

          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Search Icons
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for icons... (e.g., home, user, mail)"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Stats */}
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Showing {iconNames.length} icons from {currentLibrary.name}
          </div>
        </div>

        {/* Icon Grid */}
        <div className="glass-card p-4 sm:p-6">
          {iconNames.length === 0 ? (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              No icons found. Try a different search term.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
              {iconNames.map((iconName) => {
                const IconComponent = currentLibrary.icons[iconName];
                return (
                  <button
                    key={iconName}
                    onClick={() => copyToClipboard(iconName)}
                    className="group relative flex flex-col items-center justify-center p-4 rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600 transition-all hover:shadow-lg hover:scale-105"
                    title={`Click to copy: ${iconName}`}
                  >
                    <IconComponent className="w-8 h-8 text-gray-700 dark:text-gray-300 mb-2" />
                    <span className="text-xs text-gray-600 dark:text-gray-400 text-center break-all">
                      {iconName}
                    </span>
                    
                    {/* Copied indicator */}
                    {copiedIcon === iconName && (
                      <div className="absolute inset-0 flex items-center justify-center bg-green-500 bg-opacity-90 rounded-lg">
                        <span className="text-white font-medium text-sm">Copied!</span>
                      </div>
                    )}
                    
                    {/* Hover tooltip */}
                    <div className="absolute bottom-full mb-2 hidden group-hover:block bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10">
                      Click to copy import
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Usage Instructions */}
        <div className="glass-card p-4 sm:p-6 mt-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            How to Use
          </h2>
          <div className="space-y-3 text-gray-700 dark:text-gray-300">
            <p>
              <strong>1.</strong> Click on any icon to copy its import statement
            </p>
            <p>
              <strong>2.</strong> Paste the import at the top of your component file
            </p>
            <p>
              <strong>3.</strong> Use the icon as a React component
            </p>
          </div>
          
          <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <p className="text-sm font-mono text-gray-800 dark:text-gray-200">
              {`import { FaHome } from 'react-icons/fa';`}
            </p>
            <p className="text-sm font-mono text-gray-800 dark:text-gray-200 mt-2">
              {`<FaHome size={24} className="text-blue-500" />`}
            </p>
          </div>
        </div>

        {/* Quick Links */}
        <div className="glass-card p-4 sm:p-6 mt-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Resources
          </h2>
          <div className="space-y-2">
            <a
              href="https://react-icons.github.io/react-icons/"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-primary hover:underline"
            >
              → Official React Icons Website
            </a>
            <a
              href="https://react-icons.github.io/react-icons/search"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-primary hover:underline"
            >
              → Search All Icons Online
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IconBrowser;
