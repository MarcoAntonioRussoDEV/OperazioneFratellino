export const blobToSrc = (bytes) => {
  return `data:image/png;base64,${bytes}`;
};

export const createInitialsImage = (initials) => {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  const size = 1024;

  canvas.width = size;
  canvas.height = size;

  context.fillStyle = `hsl(${getCSSVariableValue('--muted')})`;
  context.fillRect(0, 0, size, size);

  context.font = 'bold 280px Arial';
  context.fillStyle = `hsl(${getCSSVariableValue('--foreground')})`;
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillText(initials, size / 2, size / 2);
  return canvas
    .toDataURL('image/png')
    .replace(/^data:image\/(png|jpg);base64,/, '');
};

export const getCSSVariableValue = (variable) => {
  const root = document.body;
  const isDarkMode = root.classList.contains('dark');
  const styles = getComputedStyle(
    isDarkMode ? document.querySelector('.dark') : root,
  );
  return styles.getPropertyValue(variable).trim();
};
