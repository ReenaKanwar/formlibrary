import { TextField }    from '../components/fields/TextField';
import { EmailField }   from '../components/fields/EmailField';
import { PasswordField } from '../components/fields/PasswordField';
import { CheckboxField } from '../components/fields/CheckboxField';
import { RadioField }   from '../components/fields/RadioField';
import { SelectField }  from '../components/fields/SelectField';
import { TextAreaField } from '../components/fields/TextAreaField';
import { FileField }    from '../components/fields/FileField';
import { DateField }    from '../components/fields/DateField';
import { NumberField }  from '../components/fields/NumberField';

export const fieldMapper = {
  text:     TextField,
  email:    EmailField,
  password: PasswordField,
  checkbox: CheckboxField,
  radio:    RadioField,
  select:   SelectField,
  textarea: TextAreaField,
  file:     FileField,
  date:     DateField,
  number:   NumberField,
};
