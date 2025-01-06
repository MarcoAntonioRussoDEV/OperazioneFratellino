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
import { USER } from '@/config/entity/entities';
import withFormContext from '@/components/HOC/withFormContext';
import SimpleInput from '@/components/form/SimpleInput';
import SimpleCombobox from '@/components/form/SimpleCombobox';
import { useDispatch, useSelector } from 'react-redux';
import { getAllCities, resetStatus } from '@/redux/citiesSlice';
import { getAllRoles } from '@/redux/rolesSlice';
import { useToast } from '@/hooks/use-toast';
import iconToast from '@/utils/toastUtils';
const EnanchedSimpleInput = withFormContext(SimpleInput);
const EnanchedSimpleCombobox = withFormContext(SimpleCombobox);

const RegisterForm = () => {
  const tc = useTranslateAndCapitalize();
  const [fetchStatus, setFetchStatus] = useState('idle');
  const [response, setResponse] = useState('');
  const { cities, status: citiesStatus } = useSelector((state) => state.cities);
  const { roles, status: rolesStatus } = useSelector((state) => state.roles);
  const dispatch = useDispatch();
  const [suggestions, setSuggestions] = useState([]);
  const [isFocus, setIsFocus] = useState(false);
  const { toast } = useToast();
  useEffect(() => {
    if (citiesStatus === 'idle' && cities.length === 0) {
      dispatch(getAllCities());
    }
  }, [cities, citiesStatus, dispatch, suggestions]);

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
    resolver: zodResolver(USER.formSchema),
    defaultValues: USER.defaultValues,
    mode: 'onChange',
  });
  const {
    formState: { isValid, errors },
    setValue,
    getValues,
    trigger,
  } = form;

  const handleSubmit = async (data) => {
    try {
      const response = await axios.post('/api/auth/register', data);
      setResponse(response.data.message);
      setFetchStatus('created');
    } catch (error) {
      setFetchStatus('failed');
      setResponse(error.response.data.message);
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
        currentToast.dismiss();
      };
    }
  }, [fetchStatus, toast, dispatch]);
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
        <EnanchedSimpleInput
          className="w-full"
          name="password"
          label="password"
          type="password"
        />
        <EnanchedSimpleInput
          className="w-full"
          name="email"
          label="email"
          type="email"
        />
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
        <EnanchedSimpleCombobox
          name="role"
          label="role"
          list={roles.map((role) => role.name)}
          fieldValue="name"
          placeholder="selectRole"
        />

        <Button
          size="thin"
          isNotValid={!isValid}
          isLoading={fetchStatus === 'loading'}
          className="col-span-2 w-full"
        >
          {tc('create').toUpperCase()}
        </Button>
      </form>
    </Form>
  );
};

export default RegisterForm;
