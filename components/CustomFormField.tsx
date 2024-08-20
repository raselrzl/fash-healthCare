"use client";

import {
    FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { E164Number } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { Control } from "react-hook-form";
import { FormFieldType } from "./forms/PatientForm";
import { Input } from "./ui/input";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import { Select, SelectContent, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Checkbox } from "./ui/checkbox";
// Dynamically import PhoneInput to avoid SSR issues
const PhoneInput = dynamic(() => import("react-phone-number-input"), { ssr: false });

interface CustomProps {
  control: Control<any>;
  name: string;
  label?: string;
  placeholder?: string;
  iconSrc?: string;
  iconAlt?: string;
  disabled?: boolean;
  dateFormat?: string;
  showTimeSelect?: boolean;
  children?: React.ReactNode;
  renderSkeleton?: (field: any) => React.ReactNode;
  fieldType: FormFieldType;
}

const RenderField = ({ field, props }: { field: any; props: CustomProps }) => {
  const { fieldType, iconSrc, iconAlt, placeholder, showTimeSelect, dateFormat, renderSkeleton } = props;
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  switch (fieldType) {
    case FormFieldType.INPUT:
      return (
        <div className="flex rounded-sm border-dark-500 bd-dark-400">
          {iconSrc && (
            <Image
              src={iconSrc}
              height={24}
              width={24}
              alt={iconAlt || "icon"}
              className="ml-2"
            />
          )}
          <FormControl>
            <Input
              placeholder={placeholder}
              {...field}
              className="shad-input border-0"
            />
          </FormControl>
        </div>
      );

    case FormFieldType.PHONE_INPUT:
      return isMounted ? (
        <FormControl>
          <PhoneInput
            defaultCountry="US"
            placeholder={placeholder}
            international
            withCountryCallingCode
            value={field.value as E164Number | undefined}
            onChange={field.onChange}
            className="input-phone"
          />
        </FormControl>
      ) : (
        props.renderSkeleton && props.renderSkeleton(field)
      );

    case FormFieldType.SKELETON:
      return renderSkeleton ? renderSkeleton(field) : null;
    
    case FormFieldType.DATE_PICKER:
      return (
        <div className="flex rounded-md border border-dark-500 bg-dark-400">
          <Image 
            src="/assets/icons/calendar.svg"
            height={24}
            width={24}
            alt="Calendar"
            className="ml-2"
          />
          <FormControl>
            <DatePicker 
              selected={field.value} 
              onChange={(date) => field.onChange(date)} 
              dateFormat={dateFormat ?? 'dd/MM/yyyy'}
              showTimeSelect={showTimeSelect ?? false}
              timeInputLabel="Time:"
              wrapperClassName="date-picker"
            />
          </FormControl>
        </div>
      )
    
    case FormFieldType.SELECT:
      return (
        <FormControl>
          <Select  onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger  className="shad-select-trigger">
              <SelectValue placeholder={placeholder}
              />
              </SelectTrigger>
            </FormControl>
            <SelectContent className="shad-select-content">
              {props.children}
            </SelectContent>
          </Select>
        </FormControl>
      )

    case FormFieldType.TEXTAREA:
      return(
        <FormControl>
          <Textarea 
            placeholder={placeholder}
            {...field}
            className="shad-textArea"
            disabled={props.disabled}
          />
        </FormControl>
      )

    case FormFieldType.CHECKBOX:
        return (
          <FormControl>
            <div className="flex items-center gap-4">
              <Checkbox
                id={props.name}
                checked={field.value}
                onCheckedChange={field.onChange}
              />
              <label htmlFor={props.name} className="checkbox-label">
                {props.label}
              </label>
            </div>
          </FormControl>
        );
    default:
      return null;
  }
};

const CustomFormField = (props: CustomProps) => {
  return (
    <FormField
      control={props.control}
      name={props.name}
      render={({ field }) => (
        <FormItem>
          {props.label && <FormLabel>{props.label}</FormLabel>}
          <RenderField field={field} props={props} />
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default CustomFormField;
