import { useTranslateAndCapitalize } from '@/utils/formatUtils';
import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ChevronLeft } from 'lucide-react';
const Error = () => {
  const { errorCode } = useParams();
  const location = useLocation();
  const tc = useTranslateAndCapitalize();
  const navigate = useNavigate();

  const handleBackHome = () => {
    navigate('/');
  };

  return (
    <>
      <div className="w-full flex gap-5 mt-10 justify-center items-center">
        <h1 className="text-5xl">{errorCode}</h1>
        <Separator orientation="vertical" />
        <p className="text-xl italic">{tc(location.state?.message)}</p>
      </div>
      <Button className="mt-10 w-fit mx-auto" onClick={handleBackHome}>
        <ChevronLeft />
        {tc('backHome')}
      </Button>
    </>
  );
};

export default Error;
