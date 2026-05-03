"use client";

import { useState, useEffect } from 'react';
import styles from './ExitIntentPopup.module.css';

export default function ExitIntentPopup() {
  const [isVisible, setIsVisible] = useState(false);

  const showPopup = () => {
    if (!sessionStorage.getItem('exitPopupShown')) {
      setIsVisible(true);
      sessionStorage.setItem('exitPopupShown', 'true');
    }
  };

  const closePopup = () => {
    setIsVisible(false);
  };

  useEffect(() => {
    // Desktop: Mouse exit intent (when mouse leaves top of window)
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) {
        showPopup();
      }
    };

    // Mobile: Intercept back button
    // Push a new state to history so the first "back" click triggers popstate
    window.history.pushState({ popup: true }, '');

    const handlePopState = (e: PopStateEvent) => {
      // Show popup when user tries to go back
      showPopup();
      // Optionally push state again if you want to keep them on the page
      // window.history.pushState({ popup: true }, '');
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('popstate', handlePopState);

    // Clean up
    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && closePopup()}>
      <div className={styles.popup}>
        <button className={styles.closeButton} onClick={closePopup} aria-label="Cerrar">✕</button>
        
        <h2 className={styles.title}>¡ESPERA! QUEREMOS AYUDARTE</h2>
        <h3 className={styles.subtitle}>Antes de que te vayas, tenemos una oferta especial para ti.</h3>
        
        <p className={styles.text}>
          Sabemos que tomar la decisión puede costar, pero de verdad queremos ayudarte a comenzar. Por eso, puedes llevarte el recetario completo por un precio exclusivo.
        </p>

        <div className={styles.priceBox}>
          <div className={styles.price}>$6.99</div>
        </div>

        <div className={styles.benefitsList}>
          <div className={styles.benefitItem}><span>✔</span> Acceso al recetario completo</div>
          <div className={styles.benefitItem}><span>✔</span> Incluye todos los bonos</div>
          <div className={styles.benefitItem}><span>✔</span> Garantía de 7 días sin riesgo</div>
        </div>

        <p className={styles.urgencyText}>
          Esta oferta solo aparece una vez y está disponible por tiempo limitado.
        </p>

        <a 
          href="https://pay.hotmart.com/U105652145O?off=ie7gia4w&checkoutMode=10" 
          className={styles.mainCta}
          onClick={(e) => {
            e.preventDefault();

            if (typeof window !== 'undefined' && window.fbq) {
              window.fbq('track', 'InitiateCheckout', { content_name: 'Exit Intent Offer' });
            }

            setTimeout(() => {
              window.location.href = "https://pay.hotmart.com/U105652145O?off=ie7gia4w&checkoutMode=10";
            }, 400);
          }}
        >
          QUIERO MI OFERTA POR $6.99
        </a>

        <button className={styles.secondaryCta} onClick={closePopup}>
          No, prefiero perder esta oportunidad
        </button>
      </div>
    </div>
  );
}
