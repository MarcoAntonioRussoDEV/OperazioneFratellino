import { React, useEffect, useState } from 'react';
import QRCode from 'react-qr-code';
import { toHSL } from '@/utils/FormatUtils';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

const QrCodeGenerator = ({ size, value }) => {
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
  return (
    <>
      <QRCode
        size={size}
        value={value}
        bgColor={bgColor}
        fgColor={fgColor}
        className="rounded-lg border border-accent"
      />
    </>
  );
};

QrCodeGenerator.propTypes = {
  size: PropTypes.string,
  value: PropTypes.string.isRequired,
};

export default QrCodeGenerator;
