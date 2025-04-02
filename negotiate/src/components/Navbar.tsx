import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Scale, History, Menu, X } from 'lucide-react';

function Navbar() {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      scrolled ? 'bg-gray-800 shadow-lg shadow-black/20 py-2 border-b border-gray-700' : 'bg-transparent py-4'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2 group">
            <Scale className="h-8 w-8 text-brown-theme group-hover:text-brown-theme transition-colors duration-300" />
            <div className="font-bold text-2xl tracking-tight">
              <span className="text-brown-theme group-hover:text-gray-200 transition-colors duration-300">Vakeel.</span>
              <span className="text-gray-200 group-hover:text-brown-theme transition-colors duration-300">Ai</span>
            </div>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex text-white items-center space-x-8">
            <NavLink to="/" current={location.pathname === '/'}>
              <Scale className="w-5 h-5 mr-2" />
              New Negotiation
            </NavLink>
            <NavLink to="/history" current={location.pathname === '/history'}>
              <History className="w-5 h-5 mr-2" />
              History
            </NavLink>
            <button className="bg-brown-theme hover:bg-brown-theme text-white px-6 py-2 rounded-full font-medium shadow-md hover:shadow-brown-theme/30 transition-all duration-300 transform hover:-translate-y-0.5">
              Get Started
            </button>
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={toggleMenu}
              className="text-gray-300 hover:text-brown-theme focus:outline-none transition-colors duration-300"
            >
              {isMenuOpen ? 
                <X className="h-6 w-6" /> : 
                <Menu className="h-6 w-6" />
              }
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pt-4 pb-3 border-t border-gray-700 mt-2 space-y-2">
            <NavLink 
              to="/" 
              current={location.pathname === '/'} 
              mobile={true}
              onClick={() => setIsMenuOpen(false)}
            >
              <Scale className="w-5 h-5 mr-2" />
              New Negotiation
            </NavLink>
            <NavLink 
              to="/history" 
              current={location.pathname === '/history'} 
              mobile={true}
              onClick={() => setIsMenuOpen(false)}
            >
              <History className="w-5 h-5 mr-2" />
              History
            </NavLink>
            <div className="pt-2">
              <button className="w-full brown-theme hover:bg-brown-theme text-white px-4 py-2 rounded-full font-medium shadow-md transition-colors duration-300">
                Get Started
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

function NavLink({ children, to, current, mobile = false, onClick }) {
  const baseClasses = "flex items-center font-medium transition-all duration-300";
  
  const desktopClasses = current
    ? "text-brown-theme relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-brown-theme after:rounded"
    : "text-gray-300 hover:text-brown-theme relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-brown-theme hover:after:w-full after:transition-all after:duration-300";
  
  const mobileClasses = current
    ? "text-brown-theme py-2 px-3 bg-gray-700 rounded-lg"
    : "text-gray-300 hover:text-brown-theme py-2 px-3 hover:bg-gray-700 rounded-lg";

  return (
    <Link
      to={to}
      className={`${baseClasses} ${mobile ? mobileClasses : desktopClasses}`}
      onClick={onClick}
    >
      {children}
    </Link>
  );
}

export default Navbar;
