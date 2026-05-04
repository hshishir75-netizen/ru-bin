
import React, { useState, useEffect, useRef } from 'react';
import { RESOURCES, USEFUL_LINKS, GALLERY_IMAGES, DEV_INFO, YOUTUBE_VIDEO_ID, UNIVERSITY_LOGO_URL } from './constants';

const MiniCalendar: React.FC = () => {
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setDate(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const dayName = date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
  const dayNumber = date.getDate();
  const monthName = date.toLocaleDateString('en-US', { month: 'short' });

  return (
    <div className="flex items-center ml-1 md:ml-4 border-l border-slate-200 pl-1 md:pl-4 h-10">
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden flex flex-col items-center min-w-[36px] md:min-w-[44px] relative">
        <div className="bg-red-600 w-full text-[6px] md:text-[8px] font-bold text-white text-center py-0.5 leading-tight">
          {dayName}
        </div>
        <div className="flex items-center justify-center py-1 px-1.5">
          <span className="text-slate-800 text-[12px] md:text-base font-bold leading-none">
            {dayNumber}
          </span>
        </div>
      </div>
      <div className="ml-1 md:ml-2 flex flex-col justify-center">
        <span className="text-[7px] md:text-[10px] font-bold text-slate-400 uppercase tracking-tighter leading-none">{monthName}</span>
        <span className="text-[6px] md:text-[10px] font-medium text-slate-400 leading-none">{date.getFullYear()}</span>
      </div>
    </div>
  );
};

const DigitalClock: React.FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getDayStageInfo = (hour: number) => {
    /** 
     * Requested schedule:
     * 5:00 AM – 7:00 AM Dawn
     * 7:00 AM – 12:00 PM Morning
     * 12:00 PM – 4:00 PM Noon
     * 4:00 PM – 6:00 PM Afternoon
     * 6:00 PM – 8:00 PM Evening
     * 8:00 PM – 11:00 PM Night
     * 11:00 PM – 5:00 AM Mid Night
     */
    if (hour >= 5 && hour < 7) return { icon: 'fa-mountain-sun', label: 'DAWN', color: 'text-orange-500' };
    if (hour >= 7 && hour < 12) return { icon: 'fa-sun', label: 'MORNING', color: 'text-yellow-500' };
    if (hour >= 12 && hour < 16) return { icon: 'fa-certificate', label: 'NOON', color: 'text-amber-500 animate-pulse' };
    if (hour >= 16 && hour < 18) return { icon: 'fa-cloud-sun', label: 'AFTERNOON', color: 'text-orange-400' };
    if (hour >= 18 && hour < 20) return { icon: 'fa-cloud-moon', label: 'EVENING', color: 'text-pink-400' };
    if (hour >= 20 && hour < 23) return { icon: 'fa-moon', label: 'NIGHT', color: 'text-indigo-400' };
    return { icon: 'fa-star-and-crescent', label: 'MID NIGHT', color: 'text-blue-900' };
  };

  const hours = time.getHours();
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();
  
  const stageInfo = getDayStageInfo(hours);
  const displayHours = hours % 12 || 12;
  const displayMinutes = minutes < 10 ? `0${minutes}` : minutes;
  const displaySeconds = seconds < 10 ? `0${seconds}` : seconds;

  return (
    <div className="flex items-center ml-1 md:ml-3 border-l border-slate-200 pl-1 md:pl-3 h-10">
      <div className="flex flex-col items-start min-w-[70px] md:min-w-[90px]">
        <div className="flex items-baseline space-x-0.5 md:space-x-1">
          <span className="text-[10px] md:text-base font-bold text-slate-800 tabular-nums leading-none">
            {displayHours}:{displayMinutes}
          </span>
          <span className="text-[7px] md:text-[10px] font-bold text-red-500 tabular-nums leading-none w-3 md:w-4">
            {displaySeconds}
          </span>
        </div>
        <div className={`flex items-center space-x-1 mt-0.5 ${stageInfo.color}`}>
          <i className={`fas ${stageInfo.icon} text-[7px] md:text-[9px]`}></i>
          <span className="text-[6px] md:text-[8px] font-black uppercase tracking-wider leading-none">
            {stageInfo.label}
          </span>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [showEmail, setShowEmail] = useState(false);
  const [copied, setCopied] = useState(false);
  const lastScrollY = useRef(0);
  const autoSlideRef = useRef<number | null>(null);

  const startAutoSlide = () => {
    stopAutoSlide();
    autoSlideRef.current = window.setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % GALLERY_IMAGES.length);
    }, 3000);
  };

  const stopAutoSlide = () => {
    if (autoSlideRef.current) window.clearInterval(autoSlideRef.current);
  };

  useEffect(() => {
    startAutoSlide();
    return () => stopAutoSlide();
  }, []);

  const nextImage = () => {
    setCurrentSlide((prev) => (prev + 1) % GALLERY_IMAGES.length);
    startAutoSlide();
  };

  const prevImage = () => {
    setCurrentSlide((prev) => (prev === 0 ? GALLERY_IMAGES.length - 1 : prev - 1));
    startAutoSlide();
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY < 10) {
        setIsVisible(true);
        lastScrollY.current = currentScrollY;
        return;
      }
      if (Math.abs(currentScrollY - lastScrollY.current) > 5) {
        if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
          if (!isMenuOpen) setIsVisible(false);
        } else {
          setIsVisible(true);
        }
        lastScrollY.current = currentScrollY;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMenuOpen]);

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(DEV_INFO.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col pt-[66px]">
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 glass-card px-2 md:px-6 py-2 shadow-sm border-b border-slate-200/50 transition-transform duration-300 ease-in-out ${
          isVisible ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Left: Logo (Clickable) + Title (Clickable) + Widgets */}
          <div className="flex items-center min-w-0">
            <a 
              href="https://www.ru.ac.bd/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center space-x-1 md:space-x-3 shrink-0 hover:opacity-80 transition-opacity"
            >
              <img 
                src={UNIVERSITY_LOGO_URL} 
                alt="RU Logo" 
                className="h-[35px] md:h-[50px] w-auto object-contain bg-white p-1 rounded-md shadow-sm" 
              />
              <div className="hidden sm:flex flex-col">
                <span className="text-[10px] md:text-sm font-bold text-blue-900 leading-tight">University of Rajshahi</span>
                <span className="text-[8px] md:text-[10px] font-medium text-slate-500 uppercase tracking-wider">Banking & Insurance</span>
              </div>
            </a>
            
            {/* Widgets - Permanent Visibility on mobile and web */}
            <div className="flex items-center shrink-0">
              <MiniCalendar />
              <DigitalClock />
            </div>
          </div>

          {/* Center: Desktop Nav Links */}
          <div className="hidden lg:flex space-x-6 text-sm font-medium text-slate-600">
            <a href="#home" className="hover:text-blue-700 transition-all hover:scale-105">Home</a>
            <a href="#materials" className="hover:text-blue-700 transition-all hover:scale-105">Resources</a>
            <a href="#links" className="hover:text-blue-700 transition-all hover:scale-105">Quick Links</a>
            <a href="#media" className="hover:text-blue-700 transition-all hover:scale-105">Campus Media</a>
            <a href="#contact" className="hover:text-blue-700 transition-all hover:scale-105">Contact</a>
          </div>

          {/* Right: Hamburger (Mobile) */}
          <div className="flex items-center shrink-0 ml-1">
            <button 
              className="lg:hidden text-slate-600 p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle Menu"
            >
              <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden mt-4 space-y-4 pb-4 animate-fadeIn px-2 border-t border-slate-100 pt-4 max-h-[80vh] overflow-y-auto">
            <a href="#home" className="block text-slate-600 font-medium hover:text-blue-700" onClick={handleLinkClick}>Home</a>
            <a href="#materials" className="block text-slate-600 font-medium hover:text-blue-700" onClick={handleLinkClick}>Resources</a>
            <a href="#links" className="block text-slate-600 font-medium hover:text-blue-700" onClick={handleLinkClick}>Quick Links</a>
            <a href="#media" className="block text-slate-600 font-medium hover:text-blue-700" onClick={handleLinkClick}>Campus Media</a>
            <a href="#contact" className="block text-slate-600 font-medium hover:text-blue-700" onClick={handleLinkClick}>Contact</a>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative py-16 md:py-24 px-6 overflow-hidden scroll-mt-24">
        <div className="absolute top-0 right-0 -z-10 w-1/2 h-1/2 bg-blue-50 rounded-full blur-3xl opacity-60 transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <img 
              src={UNIVERSITY_LOGO_URL} 
              alt="University of Rajshahi Logo" 
              className="w-32 h-32 md:w-44 md:h-44 mx-auto object-contain drop-shadow-xl transition-transform hover:scale-105 duration-500"
            />
          </div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold text-blue-900 mb-2 leading-tight tracking-tight">
            University of Rajshahi
          </h1>
          <h2 className="text-2xl md:text-3xl font-semibold text-slate-700 mb-10">
            Department of Banking & Insurance
          </h2>
          
          <div className="bg-white/60 backdrop-blur-sm p-8 md:p-12 rounded-[2.5rem] border border-white shadow-xl inline-block max-w-4xl">
            <p className="text-lg md:text-2xl text-slate-700 leading-relaxed font-medium">
              Welcome to the Banking & Insurance Department’s Student Resource Hub.
              A website created by students, for students. Here you can easily access and download essential PDFs, notes, and documents to support your academic journey.
            </p>
          </div>
        </div>
      </section>

      {/* Study Materials Section */}
      <section id="materials" className="py-20 bg-slate-100 px-6 scroll-mt-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Study Resources</h2>
            <div className="w-20 h-1.5 bg-blue-600 mx-auto rounded-full mb-4"></div>
            <div className="text-slate-700 max-w-2xl mx-auto leading-relaxed">
              <p className="text-lg font-semibold uppercase tracking-wide">Download PDFs, Notes, Course Outline</p>
              <p className="text-sm mt-1 opacity-80">(Click any server icon below) <span className="text-blue-700 font-bold">(No login Require)</span></p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {RESOURCES.map((res, idx) => (
              <a 
                key={idx} 
                href={res.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="group p-10 rounded-3xl bg-white shadow-md hover:shadow-2xl transition-all transform hover:-translate-y-2 flex flex-col items-center text-center"
              >
                <div className={`w-20 h-20 ${res.color} rounded-2xl flex items-center justify-center text-white text-3xl mb-6 shadow-inner transition-transform group-hover:scale-110 group-hover:rotate-6`}>
                  <i className={`fas ${res.icon}`}></i>
                </div>
                <h3 className="text-xl font-bold text-slate-900">{res.label}</h3>
              </a>
            ))}
          </div>
          <div className="mt-12 text-center">
            <div className="inline-block px-6 py-4 bg-white/50 border border-slate-200 rounded-2xl max-w-2xl text-slate-500 text-sm italic shadow-sm">
              <i className="fas fa-info-circle mr-2 text-blue-600"></i>
              Note: The course PDFs and materials provided here may vary depending on the respective course teacher. Please pardon any differences.
            </div>
          </div>
        </div>
      </section>

      {/* Frequently Used URL Section */}
      <section id="links" className="py-20 px-6 bg-white scroll-mt-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Frequently Used URL</h2>
            <div className="w-20 h-1.5 bg-blue-600 mx-auto rounded-full mb-4"></div>
            <p className="text-slate-600">Quick access to essential university portals and social platforms.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {USEFUL_LINKS.map((link, idx) => {
              const isImageUrl = link.icon.startsWith('http');
              return (
                <a 
                  key={idx} 
                  href={link.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-start p-6 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-lg hover:border-blue-200 transition-all group"
                >
                  <div className={`w-14 h-14 ${link.bgColor} rounded-xl flex items-center justify-center text-white text-xl flex-shrink-0 mr-4 shadow-sm group-hover:rotate-12 transition-transform overflow-hidden mt-1`}>
                    {isImageUrl ? (
                      <img src={link.icon} alt={link.label} className="w-full h-full object-cover p-1.5" />
                    ) : (
                      <i className={link.icon}></i>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <h3 className="text-base font-bold text-slate-800 leading-snug group-hover:text-blue-700 transition-colors">{link.label}</h3>
                    {link.caption && (
                      <p className="text-[11px] text-slate-500 mt-1 leading-tight">{link.caption}</p>
                    )}
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* Campus Media Section */}
      <section id="media" className="py-20 bg-slate-50 px-6 scroll-mt-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Campus Media</h2>
            <div className="w-20 h-1.5 bg-blue-600 mx-auto rounded-full mb-4"></div>
            <p className="text-slate-600">Memories from our department's tours and events.</p>
          </div>
          
          <div className="flex flex-col gap-12 items-center">
            {/* Video Area */}
            <div className="w-full max-w-4xl">
              <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl bg-black">
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src={`https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}`}
                  title="Campus Picnic Video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              <div className="mt-6 p-6 glass-card rounded-2xl border-l-4 border-blue-700 bg-white shadow-sm">
                <h3 className="text-xl font-bold mb-2">University Picnic Tour</h3>
                <p className="text-slate-600 italic">"A journey through nature and friendship. Watch the highlights of our recent department trip."</p>
              </div>
            </div>

            {/* Gallery Area */}
            <div className="w-full max-w-4xl relative group">
              <div className="relative h-[300px] sm:h-[450px] md:h-[550px] lg:h-[600px] bg-slate-900 rounded-3xl overflow-hidden shadow-2xl">
                {GALLERY_IMAGES.map((img, idx) => (
                  <div
                    key={idx}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                      idx === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
                    }`}
                  >
                    <div 
                      className="absolute inset-0 bg-cover bg-center blur-2xl opacity-40 scale-110"
                      style={{ backgroundImage: `url(${img.url})` }}
                    />
                    <img
                      src={img.url}
                      alt="Gallery Slide"
                      className="relative z-10 w-full h-full object-contain p-2 sm:p-4 transition-transform duration-700 group-hover:scale-[1.01]"
                    />
                  </div>
                ))}

                <button 
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white flex items-center justify-center hover:bg-white/40 transition-all opacity-0 group-hover:opacity-100 z-30 shadow-lg"
                  aria-label="Previous Image"
                >
                  <i className="fas fa-chevron-left"></i>
                </button>
                <button 
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white flex items-center justify-center hover:bg-white/40 transition-all opacity-0 group-hover:opacity-100 z-30 shadow-lg"
                  aria-label="Next Image"
                >
                  <i className="fas fa-chevron-right"></i>
                </button>
                
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2 z-30">
                  {GALLERY_IMAGES.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setCurrentSlide(idx);
                        startAutoSlide();
                      }}
                      className={`w-2 h-2 md:w-2.5 md:h-2.5 rounded-full transition-all duration-300 ${
                        idx === currentSlide ? 'bg-white w-6 md:w-8 shadow-sm' : 'bg-white/40 hover:bg-white/60'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="contact" className="py-20 bg-slate-950 text-white px-6 scroll-mt-24">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="w-64 h-64 flex-shrink-0 relative">
              <div className="absolute inset-0 border-4 border-blue-600 rounded-3xl rotate-6"></div>
              <img 
                src={DEV_INFO.photo} 
                alt={DEV_INFO.name}
                className="w-full h-full object-cover rounded-3xl relative z-10 shadow-2xl"
              />
            </div>
            <div className="flex-grow text-center md:text-left">
              <span className="inline-block px-4 py-1 bg-blue-700 text-white text-xs font-bold rounded-full mb-4 uppercase tracking-widest">ABOUT THIS WEBSITE</span>
              <h2 className="text-4xl font-bold mb-2">{DEV_INFO.name}</h2>
              
              <div className="flex flex-col space-y-1 mb-6">
                <div className="flex items-center justify-center md:justify-start space-x-2 text-slate-300">
                  <i className="fas fa-graduation-cap text-blue-500 w-5"></i>
                  <span className="font-medium">{DEV_INFO.universityBatch}</span>
                </div>
                <div className="flex items-center justify-center md:justify-start space-x-2 text-slate-300">
                  <i className="fas fa-landmark text-blue-500 w-5"></i>
                  <span className="font-medium">{DEV_INFO.departmentBatch}</span>
                </div>
              </div>

              <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                {DEV_INFO.bio}
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-left mb-6">
                <div 
                  role="button"
                  tabIndex={0}
                  onClick={() => setShowEmail(!showEmail)}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setShowEmail(!showEmail); }}
                  className="flex items-center space-x-4 bg-slate-900 p-4 rounded-2xl border border-slate-800 transition-all hover:border-blue-600 w-full text-left group overflow-hidden relative cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-600/50"
                  aria-label={showEmail ? "Email address visible" : "Tap to view email contact"}
                >
                  {!showEmail && (
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center transition-all bg-slate-800 text-blue-400 group-hover:bg-slate-700 shrink-0">
                      <i className="fas fa-envelope"></i>
                    </div>
                  )}
                  <div className="flex-grow min-w-0">
                    {!showEmail ? (
                      <>
                        <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold leading-none mb-1">Email Contact</p>
                        <p className="text-sm font-medium text-slate-400">Tap to view</p>
                      </>
                    ) : (
                      <div className="flex items-center justify-between w-full">
                        <p className="text-sm font-medium text-white truncate mr-2" title={DEV_INFO.email}>
                          {DEV_INFO.email}
                        </p>
                        <button 
                          onClick={handleCopyEmail}
                          className={`shrink-0 p-1.5 rounded-lg transition-all ${copied ? 'bg-green-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
                          title="Copy email"
                        >
                          <i className={`fas ${copied ? 'fa-check' : 'fa-copy'} text-xs`}></i>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <a 
                  href={DEV_INFO.facebook} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center space-x-4 bg-slate-900 p-4 rounded-2xl border border-slate-800 transition-colors hover:border-blue-600 group"
                >
                  <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <i className="fab fa-facebook text-xl"></i>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Facebook</p>
                  </div>
                </a>

                <a 
                  href={DEV_INFO.telegram} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center space-x-4 bg-slate-900 p-4 rounded-2xl border border-slate-800 transition-colors hover:border-blue-600 group"
                >
                  <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center text-blue-400 group-hover:bg-blue-400 group-hover:text-white transition-all">
                    <i className="fab fa-telegram text-xl"></i>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Telegram</p>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-8 bg-slate-950 text-slate-600 text-center text-sm border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-6">
          <p>© {new Date().getFullYear()} Banking & Insurance Hub, University of Rajshahi. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
