import { Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import CartDrawer from '../cart/CartDrawer';
import Toaster from '../ui/Toaster';
import MobileOrderBar from './MobileOrderBar';

/** Scrolls to top on route change, but honours in-page #hash links. */
function ScrollManager() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname, hash]);

  return null;
}

export default function Layout() {
  return (
    <div className="flex min-h-dvh flex-col">
      <ScrollManager />
      <Navbar />
      <main id="main" className="flex-1 pt-18">
        <Outlet />
      </main>
      <Footer />
      <MobileOrderBar />
      <CartDrawer />
      <Toaster />
    </div>
  );
}
