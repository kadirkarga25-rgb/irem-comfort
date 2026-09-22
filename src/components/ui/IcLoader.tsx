import React from 'react';

type IcLoaderProps = {
  label?: string;
  fullscreen?: boolean;
  className?: string;
};

export const IcLoader: React.FC<IcLoaderProps> = ({
  label = 'Yükleniyor',
  fullscreen = false,
  className = '',
}) => (
  <div className={`ic-loader-screen ${fullscreen ? 'ic-loader-fullscreen' : ''} ${className}`.trim()} aria-live="polite" aria-busy="true">
    <div className="ic-loader-wrap">
      <div className="ic-loader-mark" aria-hidden="true">
        <img className="ic-loader-layer ic-loader-ring" src="/loader/ic-ring.png" alt="" />
        <img className="ic-loader-layer ic-loader-center" src="/loader/ic-center.png" alt="" />
      </div>
      <div className="ic-loader-label">{label}</div>
    </div>
  </div>
);
