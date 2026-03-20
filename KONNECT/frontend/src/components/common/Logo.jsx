import React from 'react';
import { Handshake } from 'lucide-react';

const Logo = ({ size = 'normal', justify = 'flex-start' }) => {
  const isLarge = size === 'large';
  
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: justify, gap: isLarge ? '1rem' : '0.75rem' }}>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        width: isLarge ? '48px' : '36px', 
        height: isLarge ? '48px' : '36px', 
        borderRadius: '50%', 
        background: 'linear-gradient(135deg, #10B981, #3B82F6)', 
        color: 'white',
        boxShadow: '0 4px 6px -1px rgba(16, 185, 129, 0.3)'
      }}>
        <Handshake size={isLarge ? 28 : 20} />
      </div>
      <div className="logo-text" style={{ fontSize: isLarge ? '2rem' : '1.75rem' }}>
        KonnectSalone
      </div>
    </div>
  );
};

export default Logo;
