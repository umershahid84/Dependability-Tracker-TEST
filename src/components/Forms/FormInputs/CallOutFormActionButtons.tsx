import { trim } from '../../../lib/utils/shared/strings';

const styles = {
  buttonContainer: `flex flex-wrap flex-row justify-between items-center w-[80%] p-5`,
  submit: `rounded-md p-3 bg-secondary hover:bg-accent-primary hover:scale-105 text-primary drop-shadow-md`,
  reset: `bg-secondary hover:bg-red-600 rounded-md p-3 hover:scale-105 text-primary
   drop-shadow-md`
};

export type CallOutFormActionButtonsProps = {
  resetFormData: () => void;
  handleFormSubmit: (e: React.SyntheticEvent) => void;
};
export function CallOutFormActionButtons({
  resetFormData,
  handleFormSubmit
}: Readonly<CallOutFormActionButtonsProps>) {
  return (
    <div className={styles.buttonContainer}>
      <input type="button" value="Submit" onClick={handleFormSubmit} className={styles.submit} />
      <input type="reset" value="Reset" className={trim(styles.reset)} onClick={resetFormData} />
    </div>
  );
}
