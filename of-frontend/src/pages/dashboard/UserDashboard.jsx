import React, { useEffect, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Controller, useForm } from 'react-hook-form';
import { USER } from '@/config/entity/entities';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
// import { axios } from '@/config/axios/axiosConfig';
import axios from 'axios';
import { USER_DATA } from '@/config/links/urls';
import withFormContext from '@/components/HOC/withFormContext';
import SimpleInput from '@/components/form/SimpleInput';
import { useSelector } from 'react-redux';

const EnhancedSimpleInput = withFormContext(SimpleInput);

const UserDashboard = () => {
  const { user } = useSelector((state) => state.user);
  const methods = useForm({
    resolver: zodResolver(USER.formSchema),
    defaultValues: USER.defaultValues,
    mode: 'onChange',
  });
  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = methods;

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append('avatar', data.avatar[0]);
    formData.append('userEmail', user.email);

    try {
      const response = axios.post(USER_DATA.setAvatar, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      console.log('File uploaded');
    } catch (error) {
      console.log('Error uploading file');
    }
  };

  return (
    <Form {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
        <EnhancedSimpleInput name="avatar" label="avatar" type="file" />
        <Button>Submit</Button>
      </form>
    </Form>
  );
};

export default UserDashboard;
