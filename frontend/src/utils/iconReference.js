/**
 * REACT ICONS REFERENCE GUIDE
 * 
 * This project uses react-icons library which provides access to multiple icon sets.
 * All icons are already installed via the react-icons package.
 * 
 * HOW TO USE:
 * 1. Import the icon you want from the appropriate library
 * 2. Use it as a React component
 * 
 * EXAMPLE:
 * import { FaHome, FaUser } from 'react-icons/fa';
 * import { MdEmail } from 'react-icons/md';
 * 
 * function MyComponent() {
 *   return (
 *     <div>
 *       <FaHome size={24} color="blue" />
 *       <FaUser className="my-icon-class" />
 *       <MdEmail style={{ fontSize: '2rem' }} />
 *     </div>
 *   );
 * }
 */

// ============================================
// AVAILABLE ICON LIBRARIES IN YOUR PROJECT
// ============================================

/**
 * Font Awesome Icons (fa)
 * Import from: 'react-icons/fa'
 * Website: https://react-icons.github.io/react-icons/icons/fa/
 * 
 * Examples:
 * - FaHome, FaUser, FaEnvelope, FaPhone, FaGithub, FaLinkedin
 * - FaTwitter, FaFacebook, FaInstagram, FaYoutube
 * - FaHeart, FaStar, FaCheck, FaTimes, FaPlus, FaMinus
 * - FaEdit, FaTrash, FaSave, FaDownload, FaUpload
 * - FaSearch, FaFilter, FaCog, FaBell, FaUser
 */

/**
 * Material Design Icons (md)
 * Import from: 'react-icons/md'
 * Website: https://react-icons.github.io/react-icons/icons/md/
 * 
 * Examples:
 * - MdHome, MdEmail, MdPhone, MdPerson, MdSettings
 * - MdNotifications, MdSearch, MdMenu, MdClose, MdAdd
 * - MdEdit, MdDelete, MdSave, MdDownload, MdUpload
 * - MdCheck, MdClear, MdArrowBack, MdArrowForward
 */

/**
 * Heroicons (hi)
 * Import from: 'react-icons/hi' (Heroicons v1)
 * Import from: 'react-icons/hi2' (Heroicons v2)
 * Website: https://react-icons.github.io/react-icons/icons/hi2/
 * 
 * Examples:
 * - HiHome, HiUser, HiMail, HiPhone, HiCog
 * - HiBell, HiSearch, HiMenu, HiX, HiPlus
 * - HiPencil, HiTrash, HiDownload, HiUpload
 */

/**
 * Bootstrap Icons (bs)
 * Import from: 'react-icons/bs'
 * Website: https://react-icons.github.io/react-icons/icons/bs/
 * 
 * Examples:
 * - BsHouse, BsPerson, BsEnvelope, BsTelephone
 * - BsGithub, BsLinkedin, BsTwitter, BsFacebook
 * - BsHeart, BsStar, BsCheck, BsX, BsPlus
 */

/**
 * Feather Icons (fi)
 * Import from: 'react-icons/fi'
 * Website: https://react-icons.github.io/react-icons/icons/fi/
 * 
 * Examples:
 * - FiHome, FiUser, FiMail, FiPhone, FiSettings
 * - FiBell, FiSearch, FiMenu, FiX, FiPlus
 * - FiEdit, FiTrash, FiDownload, FiUpload
 */

/**
 * Ant Design Icons (ai)
 * Import from: 'react-icons/ai'
 * Website: https://react-icons.github.io/react-icons/icons/ai/
 * 
 * Examples:
 * - AiOutlineHome, AiOutlineUser, AiOutlineMail
 * - AiFillHeart, AiFillStar, AiFillGithub
 */

/**
 * Ionicons (io5)
 * Import from: 'react-icons/io5'
 * Website: https://react-icons.github.io/react-icons/icons/io5/
 * 
 * Examples:
 * - IoHome, IoPerson, IoMail, IoCall, IoSettings
 * - IoNotifications, IoSearch, IoMenu, IoClose
 */

// ============================================
// ICONS CURRENTLY USED IN YOUR PROJECT
// ============================================

export const currentlyUsedIcons = {
  // From Sidebar.jsx and MobileNav.jsx
  navigation: {
    home: 'FaHome (from react-icons/fa)',
    skills: 'FaCode (from react-icons/fa)',
    projects: 'FaProjectDiagram (from react-icons/fa)',
    achievements: 'FaTrophy (from react-icons/fa)',
    contact: 'FaEnvelope (from react-icons/fa)',
  },
  
  social: {
    linkedin: 'FaLinkedin (from react-icons/fa)',
    github: 'FaGithub (from react-icons/fa)',
  },
  
  actions: {
    download: 'FaDownload (from react-icons/fa)',
    theme: 'FaSun / FaMoon (from react-icons/fa)',
    dashboard: 'FaCog (from react-icons/fa)',
    logout: 'FaSignOutAlt (from react-icons/fa)',
    menu: 'FaBars (from react-icons/fa)',
    close: 'FaTimes (from react-icons/fa)',
  }
};

// ============================================
// COMMON ICON PATTERNS
// ============================================

/**
 * SIZING:
 * <FaHome size={16} />  // Small
 * <FaHome size={24} />  // Medium (default)
 * <FaHome size={32} />  // Large
 * <FaHome size={48} />  // Extra Large
 * 
 * OR use className:
 * <FaHome className="w-6 h-6" />  // Tailwind
 */

/**
 * COLORING:
 * <FaHome color="#3B82F6" />
 * <FaHome color="blue" />
 * <FaHome className="text-blue-500" />  // Tailwind
 * <FaHome style={{ color: 'red' }} />
 */

/**
 * STYLING:
 * <FaHome className="hover:text-blue-500 transition-colors" />
 * <FaHome style={{ fontSize: '2rem', marginRight: '8px' }} />
 */

// ============================================
// POPULAR ICONS BY CATEGORY
// ============================================

export const iconsByCategory = {
  // Social Media
  social: [
    'FaFacebook', 'FaTwitter', 'FaInstagram', 'FaLinkedin',
    'FaGithub', 'FaYoutube', 'FaTiktok', 'FaDiscord',
    'FaSlack', 'FaWhatsapp', 'FaTelegram', 'FaReddit'
  ],
  
  // User Interface
  ui: [
    'FaHome', 'FaUser', 'FaCog', 'FaBell', 'FaSearch',
    'FaMenu', 'FaBars', 'FaTimes', 'FaPlus', 'FaMinus',
    'FaChevronLeft', 'FaChevronRight', 'FaChevronUp', 'FaChevronDown',
    'FaArrowLeft', 'FaArrowRight', 'FaArrowUp', 'FaArrowDown'
  ],
  
  // Actions
  actions: [
    'FaEdit', 'FaTrash', 'FaSave', 'FaDownload', 'FaUpload',
    'FaCopy', 'FaPaste', 'FaCut', 'FaPrint', 'FaShare',
    'FaCheck', 'FaTimes', 'FaUndo', 'FaRedo'
  ],
  
  // Communication
  communication: [
    'FaEnvelope', 'FaPhone', 'FaComment', 'FaComments',
    'FaVideo', 'FaMicrophone', 'FaHeadphones'
  ],
  
  // Files & Documents
  files: [
    'FaFile', 'FaFileAlt', 'FaFilePdf', 'FaFileWord',
    'FaFileExcel', 'FaFileImage', 'FaFileVideo', 'FaFileAudio',
    'FaFolder', 'FaFolderOpen'
  ],
  
  // Media
  media: [
    'FaImage', 'FaVideo', 'FaMusic', 'FaPlay', 'FaPause',
    'FaStop', 'FaForward', 'FaBackward', 'FaVolumeUp', 'FaVolumeMute'
  ],
  
  // Business
  business: [
    'FaBriefcase', 'FaBuilding', 'FaChartLine', 'FaChartBar',
    'FaChartPie', 'FaDollarSign', 'FaCreditCard', 'FaShoppingCart'
  ],
  
  // Development
  development: [
    'FaCode', 'FaCodeBranch', 'FaTerminal', 'FaBug',
    'FaDatabase', 'FaServer', 'FaCloud', 'FaGit'
  ],
  
  // Status & Feedback
  status: [
    'FaCheckCircle', 'FaTimesCircle', 'FaExclamationCircle',
    'FaInfoCircle', 'FaQuestionCircle', 'FaSpinner',
    'FaHeart', 'FaStar', 'FaThumbsUp', 'FaThumbsDown'
  ]
};

// ============================================
// QUICK REFERENCE LINKS
// ============================================

export const iconResources = {
  mainWebsite: 'https://react-icons.github.io/react-icons/',
  searchIcons: 'https://react-icons.github.io/react-icons/search',
  
  libraries: {
    fontAwesome: 'https://react-icons.github.io/react-icons/icons/fa/',
    materialDesign: 'https://react-icons.github.io/react-icons/icons/md/',
    heroicons: 'https://react-icons.github.io/react-icons/icons/hi2/',
    bootstrap: 'https://react-icons.github.io/react-icons/icons/bs/',
    feather: 'https://react-icons.github.io/react-icons/icons/fi/',
    antDesign: 'https://react-icons.github.io/react-icons/icons/ai/',
    ionicons: 'https://react-icons.github.io/react-icons/icons/io5/',
  }
};

// ============================================
// EXAMPLE USAGE COMPONENT
// ============================================

/**
 * Example Component showing how to use icons:
 * 
 * import { FaHome, FaUser, FaEnvelope, FaGithub } from 'react-icons/fa';
 * import { MdSettings } from 'react-icons/md';
 * 
 * function IconExamples() {
 *   return (
 *     <div className="flex gap-4">
 *       // Basic usage
 *       <FaHome />
 *       
 *       // With size
 *       <FaUser size={32} />
 *       
 *       // With color
 *       <FaEnvelope color="#3B82F6" />
 *       
 *       // With Tailwind classes
 *       <FaGithub className="w-8 h-8 text-gray-700 hover:text-black" />
 *       
 *       // With inline styles
 *       <MdSettings style={{ fontSize: '2rem', color: 'purple' }} />
 *       
 *       // In a button
 *       <button className="flex items-center gap-2">
 *         <FaHome />
 *         <span>Home</span>
 *       </button>
 *     </div>
 *   );
 * }
 */

export default {
  currentlyUsedIcons,
  iconsByCategory,
  iconResources
};
