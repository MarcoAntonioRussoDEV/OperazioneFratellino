import { axios } from '@/config/axios/axiosConfig';
import { PRODUCTS_DATA, USER_DATA } from '@/config/links/urls';
import jsPDF from 'jspdf';
import { loadLocale } from './localeUtils';
import i18n from '../../i18n';
import { format } from 'date-fns';

export const useGenerateSalePDF = async (sale, action) => {
  const doc = new jsPDF({ compress: true });

  const getProductUnitPrice = async (productCode) => {
    const response = await axios.get(PRODUCTS_DATA.byCode + productCode);
    return response.data.sellingPrice;
  };

  const getUserName = async (email) => {
    const response = await axios.get(USER_DATA.byEmail + sale.client);
    return response.data.name;
  };

  const loadImage = (src) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        resolve(img);
      };
    });
  };
  const formatDate = async (date) => {
    const locale = await loadLocale(i18n.language);
    return format(date, 'dd/MM/yyyy - HH:mm', { locale });
  };

  // Image
  const logo = await loadImage('/LOGO.png');
  const watermark = await loadImage('/side-pattern.png');

  const logoScale = 0.1;
  const logoWidth = logo.width * logoScale;
  const logoHeight = logo.height * logoScale;

  const watermarkScale = 0.1;
  const watermarkWidth = watermark.width * watermarkScale;
  const watermarkHeight = watermark.height * watermarkScale;

  doc.addImage(
    logo,
    'PNG',
    doc.internal.pageSize.getWidth() - logoWidth - 5,
    5,
    logoWidth,
    logoHeight,
  );

  doc.addImage(watermark, 'PNG', 0, 0, watermarkWidth, watermarkHeight);

  // title
  const BORDER_LEFT = 20;
  doc.setFontSize(18);
  doc.text(`${tc('orderSummary')} n°${sale.id}`, BORDER_LEFT, 20);

  // client
  const clientName = await getUserName(sale.client);
  doc.setFontSize(10);
  doc.text(clientName, BORDER_LEFT, 26);

  // Date
  doc.text(await formatDate(sale.createdAt), BORDER_LEFT, 32);

  // Table
  const headers = [
    [tc('product'), tc('quantity'), tc('unitPrice'), tc('totalPrice')],
  ];
  // const data = [['MAGL001', 1, '10€', 10]];
  const dataPromises = sale.products.map(async (product) => {
    const productUnitPrice = await getProductUnitPrice(product.product);
    return [
      product.product,
      product.quantity,
      `${productUnitPrice}€`,
      `${productUnitPrice * product.quantity}€`,
    ];
  });
  let data = await Promise.all(dataPromises);
  data.push([
    'TOT',
    '',
    '',
    `${data.reduce((acc, el) => acc + parseFloat(el[3].replace('€', '')), 0)}€`,
  ]);

  doc.autoTable({
    head: headers,
    body: data,
    startY: 50,
    margin: BORDER_LEFT,
  });

  if (action === 'send') {
    const pdfBlob = doc.output('blob');
    sendEmailToClient(pdfBlob);
  } else {
    doc.save(`order_num_${sale.id}`);
  }
};
