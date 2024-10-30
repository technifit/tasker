import * as React from 'react';
import parsePhoneNumberFromString, { AsYouType } from 'libphonenumber-js';
import type {
  CarrierCode,
  CountryCallingCode,
  CountryCode,
  E164Number,
  NationalNumber,
  NumberType,
} from 'libphonenumber-js';
import { CircleFlag } from 'react-circle-flags';

import { useStateHistory } from '../../hooks/use-state-history';
import { countries } from '../../lib/countries';
import { cn } from '../../lib/utils';
import { Button } from './button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from './command';
import { Check, ChevronsUpDown } from './icons';
import { Input } from './input';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { ScrollArea } from './scroll-area';

export type Country = (typeof countries)[number];

export interface PhoneData {
  phoneNumber?: E164Number;
  countryCode?: CountryCode;
  countryCallingCode?: CountryCallingCode;
  carrierCode?: CarrierCode;
  nationalNumber?: NationalNumber;
  internationalNumber?: string;
  possibleCountries?: string;
  isValid?: boolean;
  isPossible?: boolean;
  uri?: string;
  type?: NumberType;
}

interface PhoneInputProps extends React.ComponentPropsWithoutRef<'input'> {
  value?: string;
  defaultCountry?: CountryCode;
}

export function getPhoneData(phone: string): PhoneData {
  const asYouType = new AsYouType();
  asYouType.input(phone);
  const number = asYouType.getNumber();
  return {
    phoneNumber: number?.number,
    countryCode: number?.country,
    countryCallingCode: number?.countryCallingCode,
    carrierCode: number?.carrierCode,
    nationalNumber: number?.nationalNumber,
    internationalNumber: number?.formatInternational(),
    possibleCountries: number?.getPossibleCountries().join(', '),
    isValid: number?.isValid(),
    isPossible: number?.isPossible(),
    uri: number?.getURI(),
    type: number?.getType(),
  };
}

export function PhoneInput({
  value: valueProp,
  defaultCountry = 'IE',
  className,
  id,
  required = true,
  ...rest
}: PhoneInputProps) {
  const asYouType = new AsYouType();

  const inputRef = React.useRef<HTMLInputElement>(null);

  const [value, handlers, history] = useStateHistory(valueProp);

  if (value && value.length > 0) {
    defaultCountry = parsePhoneNumberFromString(value)?.getPossibleCountries()[0] ?? defaultCountry;
  }

  const [openCommand, setOpenCommand] = React.useState(false);
  const [countryCode, setCountryCode] = React.useState<CountryCode>(defaultCountry);

  const selectedCountry = countries.find((country) => country.iso2 === countryCode);

  const initializeDefaultValue = () => {
    if (value) {
      return value;
    }

    return `+${selectedCountry?.phone_code}`;
  };

  const handleOnInput = (event: React.FormEvent<HTMLInputElement>) => {
    asYouType.reset();

    let value = event.currentTarget.value;
    if (!value.startsWith('+')) {
      value = `+${value}`;
    }

    const formattedValue = asYouType.input(value);
    const number = asYouType.getNumber();
    setCountryCode(number?.country ?? defaultCountry);
    event.currentTarget.value = formattedValue;
    handlers.set(formattedValue);
  };

  const handleOnPaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    asYouType.reset();

    const clipboardData = event.clipboardData;

    if (clipboardData) {
      const pastedData = clipboardData.getData('text/plain');
      const formattedValue = asYouType.input(pastedData);
      const number = asYouType.getNumber();
      setCountryCode(number?.country ?? defaultCountry);
      event.currentTarget.value = formattedValue;
      handlers.set(formattedValue);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if ((event.metaKey || event.ctrlKey) && event.key === 'z') {
      handlers.back();
      if (inputRef.current && history.current > 0 && history.history[history.current - 1] !== undefined) {
        event.preventDefault();
        inputRef.current.value = history.history[history.current - 1] ?? '';
      }
    }
  };

  return (
    <div className={cn('flex gap-2', className)}>
      <Popover open={openCommand} onOpenChange={setOpenCommand} modal={true}>
        <PopoverTrigger asChild>
          <Button
            variant='outline'
            role='combobox'
            aria-expanded={openCommand}
            className='w-max items-center justify-between gap-2 whitespace-nowrap shadow-inner'
          >
            {selectedCountry?.name ? (
              <CircleFlag
                countryCode={selectedCountry.iso2.toLowerCase()}
                aria-labelledby={selectedCountry.name}
                title={selectedCountry.name}
                alt={selectedCountry.name}
                className='size-4 object-cover'
              />
            ) : (
              'Select country'
            )}
            <ChevronsUpDown className='size-4 shrink-0 opacity-50' />
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-max p-0' align='start'>
          <Command>
            <CommandInput placeholder='Search country...' />
            <CommandList>
              <CommandEmpty>No country found.</CommandEmpty>
              <ScrollArea className={'[&>[data-radix-scroll-area-viewport]]:max-h-[300px]'}>
                <CommandGroup>
                  {countries.map((country) => {
                    return (
                      <CommandItem
                        className='flex items-center justify-between gap-4'
                        key={country.iso3}
                        value={`${country.name} (+${country.phone_code})`}
                        onSelect={() => {
                          if (inputRef.current) {
                            inputRef.current.value = `+${country.phone_code}`;
                            handlers.set(`+${country.phone_code}`);
                            inputRef.current.focus();
                          }
                          setCountryCode(country.iso2 as CountryCode);
                          setOpenCommand(false);
                        }}
                      >
                        <div className='flex items-center justify-start gap-2'>
                          <CircleFlag
                            countryCode={country.iso2.toLowerCase()}
                            aria-labelledby={country.name}
                            title={country.name}
                            alt={country.name}
                            className='size-3 object-cover'
                          />
                          <div className='flex gap-1'>
                            {country.name}
                            <span className='text-muted-foreground'>(+{country.phone_code})</span>
                          </div>
                        </div>
                        <Check className={cn('size-4', countryCode === country.iso2 ? 'opacity-100' : 'opacity-0')} />
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              </ScrollArea>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <Input
        ref={inputRef}
        type='text'
        pattern='^(\+)?[0-9\s]*$'
        name='phone'
        id={id}
        placeholder='Phone'
        defaultValue={initializeDefaultValue()}
        onInput={handleOnInput}
        onPaste={handleOnPaste}
        onKeyDown={handleKeyDown}
        required={required}
        aria-required={required}
        {...rest}
      />
    </div>
  );
}
