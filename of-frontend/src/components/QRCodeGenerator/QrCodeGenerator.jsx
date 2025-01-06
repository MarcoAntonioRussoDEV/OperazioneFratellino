import { React, useEffect, useRef, useState } from 'react';
import QRCode from 'react-qr-code';
import { toHSL } from '@/utils/formatUtils';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Download } from 'lucide-react';

const QrCodeGenerator = ({ size, value }) => {
  const DOWNLOAD_SIZE = 512;

  const { schema } = useSelector((state) => state.theme);
  const [bgColor, setBgColor] = useState(
    toHSL(getComputedStyle(document.body).getPropertyValue('--background')),
  );
  const [fgColor, setFgColor] = useState(
    toHSL(getComputedStyle(document.body).getPropertyValue('--foreground')),
  );

  useEffect(() => {
    setTimeout(() => {
      setBgColor(
        toHSL(getComputedStyle(document.body).getPropertyValue('--background')),
      );
      setFgColor(
        toHSL(getComputedStyle(document.body).getPropertyValue('--foreground')),
      );
    }, 10);
  }, [schema]);

  const qrRef = useRef();
  const downloadQRCode = () => {
    const svg = qrRef.current.querySelector('svg');
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.href = pngFile;
      downloadLink.download = 'qrcode.png';
      downloadLink.click();
    };
    img.src = `data:image/svg+xml;base64,${btoa(svgData)}`;
  };

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <div
      onClick={downloadQRCode}
      className="cursor-pointer relative grid place-content-center border-green-500 qr-code-container"
    >
      <QRCode
        size={size}
        value={value}
        bgColor={bgColor}
        fgColor={fgColor}
        className="rounded-lg border border-accent qr-code"
      />
      <Download className="absolute left-[50%] -translate-x-1/2 top-1/2 -translate-y-1/2 pointer-events-none qr-code-download-button opacity-0" />
      <div ref={qrRef}>
        <QRCode
          size={DOWNLOAD_SIZE}
          value={value}
          bgColor={bgColor}
          fgColor={fgColor}
          className="rounded-lg border border-accent hidden"
        />
      </div>
    </div>
  );
};

QrCodeGenerator.propTypes = {
  size: PropTypes.string,
  value: PropTypes.string.isRequired,
};

export default QrCodeGenerator;
