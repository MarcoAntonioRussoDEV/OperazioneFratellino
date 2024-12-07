import React from 'react';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { useTranslateAndCapitalize } from '@/utils/FormatUtils';

const ImageDrawer = ({ imgSrc, title, description }) => {
  const tc = useTranslateAndCapitalize();
  return (
    <DrawerContent>
      <div className="mx-auto w-full max-w-sm">
        <DrawerHeader>
          <DrawerTitle className="text-center">{title}</DrawerTitle>
          <DrawerDescription className="text-center">
            {description}
          </DrawerDescription>
        </DrawerHeader>
        <img className="rounded-xl" src={imgSrc} alt="" />
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">{tc('close')}</Button>
          </DrawerClose>
        </DrawerFooter>
      </div>
    </DrawerContent>
  );
};

export default ImageDrawer;
