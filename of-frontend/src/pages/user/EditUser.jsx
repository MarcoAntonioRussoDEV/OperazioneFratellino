/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, { useEffect, useState } from 'react';
import { axios } from '../../config/axios/axiosConfig';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { capitalize, useTranslateAndCapitalize } from '@/utils/formatUtils';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { USER } from '@/config/entity/entities';
import withFormContext from '@/components/HOC/withFormContext';
import SimpleInput from '@/components/form/SimpleInput';
import SimpleCombobox from '@/components/form/SimpleCombobox';
import { useDispatch, useSelector } from 'react-redux';
import { getAllCities, resetStatus } from '@/redux/citiesSlice';
import { getAllRoles } from '@/redux/rolesSlice';
import { useToast } from '@/hooks/use-toast';
import iconToast, { STATUS_ENUM } from '@/utils/toastUtils';
import { useNavigate, useParams } from 'react-router-dom';
import { ROLE_DATA, USER_DATA } from '@/config/links/urls';
import { hasAccess } from '@/utils/authService';
import { USER_ROLES } from '@/utils/userRoles';
import { getAuthUser } from '@/redux/userSlice';
import { getAllUsers } from '@/redux/usersSlice';
const EnanchedSimpleInput = withFormContext(SimpleInput);
const EnanchedSimpleCombobox = withFormContext(SimpleCombobox);

const EditUser = () => {
  const params = useParams();
  const { user: loggedUser } = useSelector((state) => state.user);
  const [user, setUser] = useState();
  const [userStatus, setUserStatus] = useState('idle');
  const tc = useTranslateAndCapitalize();
  const [fetchStatus, setFetchStatus] = useState('idle');
  const [response, setResponse] = useState('');
  const { cities, status: citiesStatus } = useSelector((state) => state.cities);
  const { roles, status: rolesStatus } = useSelector((state) => state.roles);
  const dispatch = useDispatch();
  const [suggestions, setSuggestions] = useState([]);
  const [isFocus, setIsFocus] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (citiesStatus === 'idle' && cities.length === 0) {
      dispatch(getAllCities());
    }
  }, [cities, citiesStatus, dispatch, suggestions]);

  const fetchUser = async () => {
    const response = await axios.get(USER_DATA.byEmail + params.userEmail);
    setUser(response.data);
    setUserStatus('succeeded');
  };

  const defaultValues = {
    name: '',
    city: '',
    email: '',
    role: 'USER',
  };

  useEffect(() => {
    let cityList = [...cities];
    setSuggestions(
      cityList.sort((a, b) => {
        if (a.name.toLowerCase() < b.name.toLowerCase()) {
          return -1;
        }
        if (a.name.toLowerCase() > b.name.toLowerCase()) {
          return 1;
        }
        return 0;
      }),
    );
    dispatch(resetStatus());
  }, [cities]);

  useEffect(() => {
    if (rolesStatus === 'idle') {
      dispatch(getAllRoles());
    }
  }, [roles, dispatch, rolesStatus]);

  const form = useForm({
    resolver: zodResolver(
      z
        .object({
          name: z.string().min(4),
          phone: z.string().min(10).max(10),
          email: z.string().email().readonly(),
          oldPassword: z
            .string()
            .min(8)
            .optional()
            .or(z.literal(''))
            .transform((value) => (value === '' ? null : value)),
          newPassword: z
            .string()
            .min(8)
            .optional()
            .or(z.literal(''))
            .transform((value) => (value === '' ? null : value)),
          city: z.string().min(4),
          role: z
            .string()
            .min(2)
            .refine(async (roleName) => {
              try {
                const response = axios.get(ROLE_DATA.byName + roleName);
                return true;
              } catch (error) {
                return false;
              }
            }),
        })
        .superRefine((values, context) => {
          const { oldPassword, newPassword } = values;
          if (oldPassword === newPassword && newPassword) {
            context.addIssue({
              path: ['newPassword'],
              message: tc('passwordCantBeEquals'),
            });
          }
        }),
    ),
    defaultValues: defaultValues,
    mode: 'onChange',
  });
  const {
    formState: { isValid, errors },
    setValue,
    getValues,
    trigger,
  } = form;

  useEffect(() => {
    if (userStatus === 'idle') {
      fetchUser();
    } else if (userStatus === 'succeeded') {
      setValue('name', user.name);
      setValue('phone', user.phone);
      setValue('city', user.city);
      setValue('email', user.email);
      setValue('role', user.role);
      trigger('name', 'city', 'phone');
    }
  }, [userStatus]);

  const handleSubmit = async (data) => {
    data.password = data.newPassword;
    try {
      const response = await axios.patch(USER_DATA.edit, data);
      setResponse(response.data);
      setFetchStatus('created');
      setValue('oldPassword', null);
      setValue('newPassword', null);
      dispatch(getAuthUser());
      setTimeout(() => {
        if (loggedUser.email === params.userEmail) {
          navigate('/settings');
        } else {
          navigate('/dashboard');
        }
      }, 100);
    } catch (error) {
      setFetchStatus('failed');
      setResponse(error.response.data);
      console.log(error.response.data);
    }
  };

  const handleSelectSuggestion = (city) => {
    setValue('city', city);
    trigger('city');
  };
  const onCityChange = (e) => {
    const inputValue = e.target.value;
    setValue('city', inputValue);
    trigger('city');
    setSuggestions(
      cities.filter((city) =>
        city.name.toLowerCase().includes(inputValue.toLowerCase()),
      ),
    );
  };

  const handleBlur = () => {
    const timer = setTimeout(() => setIsFocus(false), 100);

    return () => clearTimeout(timer);
  };

  useEffect(() => {
    if (fetchStatus === 'created' || fetchStatus === 'failed') {
      const currentToast = toast(iconToast(fetchStatus, tc(response)));
      const timer = setTimeout(() => {
        setFetchStatus('idle');
      }, 6000);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [fetchStatus, toast, dispatch]);

  useEffect(() => {
    if (loggedUser.email === params.userEmail && user?.isFirstAccess) {
      const currentToast = toast(
        iconToast(STATUS_ENUM.WARNING, tc('changePassword')),
      );
      return () => {
        currentToast.dismiss();
      };
    }
  }, [user]);

  useEffect(() => {
    if (hasAccess(loggedUser.role, USER_ROLES.ADMIN)) {
      return () => {
        dispatch(getAllUsers());
      };
    }
  }, []);
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col gap-5 lg:grid  lg:grid-cols-2 gap-5 text-left place-content-center items-baseline place-items-start w-fit mx-auto"
      >
        <EnanchedSimpleInput className="w-full" name="name" label="name" />
        <EnanchedSimpleInput
          className="w-full"
          name="phone"
          label="phone"
          minlength="10"
          maxlength="10"
          type="tel"
          pattern="\d{10}"
          inputmode="numeric"
        />
        {loggedUser.email === params.userEmail && (
          <>
            <EnanchedSimpleInput
              className="w-full"
              name="oldPassword"
              label="oldPassword"
              type="password"
            />
            <EnanchedSimpleInput
              className="w-full"
              name="newPassword"
              label="newPassword"
              type="password"
            />
          </>
        )}
        <div className="relative w-full">
          <EnanchedSimpleInput
            className="w-full"
            name="city"
            label="city"
            onChange={(e) => onCityChange(e)}
            onFocus={() => {
              setIsFocus(true);
            }}
            onBlur={handleBlur}
            autoComplete="new-City"
          />
          {suggestions.length > 0 && (
            <ul
              className={`${
                isFocus || 'hidden'
              } absolute border rounded-md min-w-40 separator mt-2 left-1/2 -translate-x-1/2 p-1 bg-background popover z-10 shadow`}
            >
              {suggestions.map((city) => {
                return (
                  <li
                    onClick={() => handleSelectSuggestion(city.name)}
                    key={city.id}
                    className={`cursor-pointer text-left p-2  hover:bg-accent`}
                  >
                    {capitalize(city.name)}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
        {hasAccess(loggedUser?.role, USER_ROLES.ADMIN) && (
          <EnanchedSimpleCombobox
            name="role"
            label="role"
            list={roles.map((role) => role?.name)}
            fieldValue="name"
            placeholder="selectRole"
          />
        )}

        <Button
          size="thin"
          isNotValid={!isValid}
          isLoading={fetchStatus === 'loading'}
          className="col-span-2 w-full"
        >
          {tc('edit').toUpperCase()}
        </Button>
      </form>
    </Form>
  );
};

export default EditUser;
