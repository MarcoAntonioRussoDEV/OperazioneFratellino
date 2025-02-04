import SendMail from '@/components/SendMail';
import ActionsDropdown from '@/components/table/ActionsDropdown';
import { useToast } from '@/hooks/use-toast';
import { useAppHooks } from '@/hooks/useAppHooks';
import { loadLocale } from '@/utils/localeUtils';
import { format } from 'date-fns';
import { Download, Mail } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import i18n from '../../../../i18n';
import jsPDF from 'jspdf';
import { axios } from '@/config/axios/axiosConfig';
import { CLIENT_DATA, PRODUCTS_DATA, USER_DATA } from '@/config/links/urls';
import iconToast, { STATUS_ENUM } from '@/utils/toastUtils';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';

const SaleActionsDropdown = ({ products, id, client, createdAt }) => {
  const { tc } = useAppHooks();
  const [emailStatus, setEmailStatus] = useState('idle');
  const [emailResponse, setEmailResponse] = useState('');
  const { toast } = useToast();

  const formatDate = async (date) => {
    const locale = await loadLocale(i18n.language);
    return format(date, 'dd/MM/yyyy - HH:mm', { locale });
  };

  const handlePDF = async (action) => {
    if (emailStatus === 'idle') {
      const doc = new jsPDF({ compress: true });

      const getProductUnitPrice = async (productCode) => {
        const response = await axios.get(PRODUCTS_DATA.byCode + productCode);
        return response.data.sellingPrice;
      };

      const getUserName = async (email) => {
        const response = await axios.get(CLIENT_DATA.byEmail + client);
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
      doc.text(`${tc('orderSummary')} n°${id}`, BORDER_LEFT, 20);

      // client
      const clientName = await getUserName(client);
      doc.setFontSize(10);
      doc.text(clientName, BORDER_LEFT, 26);

      // Date
      doc.text(await formatDate(createdAt), BORDER_LEFT, 32);

      // Table
      const headers = [
        [tc('product'), tc('quantity'), tc('unitPrice'), tc('totalPrice')],
      ];
      // const data = [['MAGL001', 1, '10€', 10]];
      // eslint-disable-next-line react/prop-types
      const dataPromises = products.map(async (product) => {
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
        `${data.reduce(
          (acc, el) => acc + parseFloat(el[3].replace('€', '')),
          0,
        )}€`,
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
        doc.save(`order_num_${id}`);
      }
    }
    // doc.save('document.pdf');
  };

  const sendEmailToClient = async (
    file,
    to = client,
    subject = `OPERAZIONE FRATELLINO - ${tc('orderSummary')} n°${id}`,
    text = '',
  ) => {
    setEmailStatus('loading');
    const formData = new FormData();
    formData.append('file', file, `order-${id}-summary.pdf`);
    formData.append('to', to);
    formData.append('subject', subject);
    formData.append('text', text);

    try {
      const response = await axios.post('/email/send', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setEmailStatus(STATUS_ENUM.FULFILLED);
      setEmailResponse(response.data);
    } catch (error) {
      setEmailStatus(STATUS_ENUM.FAILED);
      setEmailResponse(error);
    }
  };

  useEffect(() => {
    if (emailStatus === STATUS_ENUM.FULFILLED) {
      setEmailStatus('idle');
      const currentToast = toast(
        iconToast(STATUS_ENUM.FULFILLED, emailResponse),
      );
    }
  });

  if (emailStatus === STATUS_ENUM.LOADING) {
    return (
      <Spinner text="end" size={'sm'}>
        {tc('sendingEmail')}
      </Spinner>
    );
  } else {
    return (
      <ActionsDropdown entityName={'sales'} primaryKey={id}>
        <button className="dropdown-button" onClick={() => handlePDF('send')}>
          {tc('sale.sendEmail')}
          <Mail />
        </button>
        <button className="dropdown-button" onClick={() => handlePDF()}>
          {tc('sale.download')}
          <Download />
        </button>
      </ActionsDropdown>
    );
  }
};

export default SaleActionsDropdown;
