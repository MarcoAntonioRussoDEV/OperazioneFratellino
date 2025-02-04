/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useEffect, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Controller, useForm } from 'react-hook-form';
import { USER } from '@/config/entity/entities';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { axios } from '@/config/axios/axiosConfig';
import { USER_DATA } from '@/config/links/urls';
import { useDispatch, useSelector } from 'react-redux';
import { getAuthUser } from '@/redux/userSlice';
import { Edit, Pencil, PlusIcon } from 'lucide-react';
import { capitalize, useTranslateAndCapitalize } from '@/utils/formatUtils';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const UserSettings = () => {
  const { user } = useSelector((state) => state.user);
  const [uploadAvatar, setUploadAvatar] = useState();
  const dispatch = useDispatch();
  const tc = useTranslateAndCapitalize();
  const navigate = useNavigate();
  const { dismiss } = useToast();

  const inputRef = useRef();

  useEffect(() => {
    if (uploadAvatar) {
      const formData = new FormData();
      formData.append('avatar', uploadAvatar);
      formData.append('userEmail', user.email);
      const token = localStorage.getItem('token');
      const uploadFile = async () => {
        try {
          const response = await axios.post(USER_DATA.setAvatar, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${token}`,
            },
          });
          console.log('response: ', response);

          dispatch(getAuthUser());
          console.log('Uploaded file');
        } catch (error) {
          console.log('Error uploading file: ', error);
        }
      };
      uploadFile();
    }
    console.log('uploadAvatar: ', uploadAvatar);
  }, [uploadAvatar]);

  const handleClickInput = () => {
    inputRef.current.click();
  };

  useEffect(() => {
    return () => dismiss();
  }, []);

  return (
    <Card className="relative w-fit mx-auto">
      <CardHeader className="w-fit">
        <form encType="multipart/form-data" className="w-fit">
          <div
            className="w-1/2 aspect-square  mx-auto rounded-full overflow-hidden flex justify-center items-center hover:outline-dashed outline-4 outline-foreground group relative cursor-pointer"
            onClick={handleClickInput}
            style={{ outlineWidth: 8 }}
          >
            <PlusIcon
              className="absolute centre opacity-0 group-hover:opacity-100 fill-foreground"
              size={48}
            />
            <img
              src={user.avatar}
              alt="avatar"
              className="object-cover h-full w-[512px] group-hover:opacity-25"
            />
          </div>
          <input
            onChange={(e) => setUploadAvatar(e.target.files[0])}
            name="avatar"
            type="file"
            className="hidden"
            ref={inputRef}
          />
        </form>
      </CardHeader>
      <CardContent className="text-start w-fit">
        <h2 className="text-2xl font-bold w-fit">{capitalize(user.name)}</h2>
        <h4 className="italic w-fit">{user.email}</h4>
        <h4 className="w-fit">{user.phone}</h4>
        <p className="w-fit">{`${tc('role')}: ${user.role}`}</p>
      </CardContent>
      <button
        className="absolute top-0 end-0 m-2 p-1 md:p-0 hover:scale-[1.1]"
        onClick={() => navigate(`/user/${user.email}`)}
      >
        <Edit />
      </button>
    </Card>
  );
};

export default UserSettings;
