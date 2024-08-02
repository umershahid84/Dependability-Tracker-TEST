import React from 'react';
import { FormLabel } from '../FormInputs/FormLabel';
import { EmployeeFormData } from '../../../client-api';
import { DynamicOptions, DynamicOption } from '../FormInputs/DynamicOptions';
import { DivisionAttributes } from '../../../lib/db/models/Division';

const styles = {
  h2: 'text-2xl font-bold mb-4',
  form: 'grid grid-cols-1 gap-4 w-full',
  buttonContainer: 'w-full flex justify-end',
  input: 'border p-2 rounded-md w-full bg-tertiary',
  inputWithMargin: 'mr-2 h-4 w-4  border-gray-300 rounded bg-tertiary',
  button: 'bg-blue-600 text-primary rounded-md py-2 px-4 hover:bg-blue-500'
};

export function FormLabelContainer({
  children,
  addClasses
}: Readonly<{ children: React.ReactNode; addClasses?: string }>): React.ReactElement {
  return (
    <div className={'w-full flex flex-col justify-start items-start' + ' ' + (addClasses ?? '')}>
      {children}
    </div>
  );
}

function RadioDivider({ children }: Readonly<{ children: React.ReactNode }>): React.ReactElement {
  return <div className="flex items-center space-x-4">{children}</div>;
}

export type EmployeeCrudFormModalLayoutProps = {
  title?: string;
  formData: EmployeeFormData;
  divisions: DivisionAttributes[];
  divisionOptions: DynamicOption['dynamicOptions'];
  onSubmit: (e: React.SyntheticEvent) => Promise<void>;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => void;
};

export function EmployeeCrudFromModalLayout({
  title,
  formData,
  onChange,
  onSubmit,
  divisions,
  divisionOptions
}: Readonly<EmployeeCrudFormModalLayoutProps>): React.ReactElement {
  return (
    <>
      <h2 className={styles.h2}>{title}</h2>
      <form className={styles.form} onSubmit={e => e.preventDefault()}>
        <FormLabelContainer>
          <FormLabel label="Employee Name" htmlFor="name" />
          <input
            required
            type="text"
            name="name"
            title="Employee Name"
            value={formData.name}
            onChange={onChange}
            className={styles.input}
          />
        </FormLabelContainer>

        <FormLabelContainer>
          <FormLabel label="Assign Employee Division:" htmlFor="division" />
          <select
            required
            name="division"
            title="Add Divisions"
            className={styles.input}
            value={formData.division}
            onChange={onChange}>
            <option value="" disabled>
              Assign Employee Division(s)
            </option>
            <DynamicOptions dynamicOptions={divisionOptions} />
            <option value={divisions.map(el => el.id).join(',')}>Assign All</option>
          </select>
        </FormLabelContainer>

        <FormLabelContainer>
          <FormLabel label="Admin?" htmlFor="isAdmin" />
          <RadioDivider>
            <FormLabel label="Yes" htmlFor="isAdmin" />
            {/* <label className="flex items-center"> */}
            <input
              value="1"
              type="radio"
              name="isAdmin"
              title="isAdmin"
              onChange={onChange}
              checked={formData.isAdmin === '1'}
              className={styles.inputWithMargin}
            />

            {/* </label> */}
            <FormLabel label="No" htmlFor="isAdmin" />
            <input
              value="0"
              type="radio"
              name="isAdmin"
              title="isAdmin"
              onChange={onChange}
              checked={formData.isAdmin === '0'}
              className={styles.inputWithMargin}
            />
          </RadioDivider>
        </FormLabelContainer>
        <FormLabelContainer>
          <FormLabel label="Supervisor?" htmlFor="isSupervisor" />
          <RadioDivider>
            <FormLabel label="Yes" htmlFor="isSupervisor" />
            <input
              value="1"
              type="radio"
              name="isSupervisor"
              title="isSupervisor"
              onChange={onChange}
              checked={formData.isSupervisor === '1'}
              className={styles.inputWithMargin}
            />

            <FormLabel label="No" htmlFor="isSupervisor" />
            <input
              value="0"
              type="radio"
              name="isSupervisor"
              title="isSupervisor"
              onChange={onChange}
              checked={formData.isSupervisor === '0'}
              className={styles.inputWithMargin}
            />
          </RadioDivider>
        </FormLabelContainer>

        <div className={styles.buttonContainer}>
          <button type="button" className={styles.button} onClick={onSubmit}>
            Submit
          </button>
        </div>
      </form>
    </>
  );
}

export default EmployeeCrudFromModalLayout;
