export type PaginationHeaderProps = {
  showing: number;
  ending: number;
  currentPage: number;
  numberOfPages: number;
  totalNumberOfRecords: number;
  handlePageIncrement: (e: React.SyntheticEvent) => void;
  handlePageDecrement: (e: React.SyntheticEvent) => void;
};

const styles = {
  button: `p-3 bg-tertiary rounded-md text-xs hover:bg-secondary`,
  text: `text-primary print:text-black w-full text-center md:text-left`,
  buttonContainer: `w-[98%] sm:w-auto flex flex-row justify-between items-center gap-8 hide-on-print`,
  buttonDisabled: `p-3 bg-tertiary rounded-md text-xs hover:bg-secondary cursor-not-allowed`,
  header: `w-full h-auto flex flex-col gap-2 sm:flex-wrap sm:flex-row justify-between items-center cursor-pointer mt-2`,
};

export function PaginationHeader({
  showing,
  ending,
  currentPage,
  numberOfPages,
  totalNumberOfRecords,
  handlePageIncrement,
  handlePageDecrement
}: Readonly<PaginationHeaderProps>): React.JSX.Element {
  return (
    <div className={styles.header}>
      <span className="w-auto mb-6 sm:mb-0 ">
        <p className={styles.text}>
          Showing {showing} to {ending} of {totalNumberOfRecords ?? 0} records
        </p>
      </span>

      <div className={styles.buttonContainer}>
        <button
          type="button"
          disabled={currentPage === 1}
          className={currentPage === 1 ? styles.buttonDisabled : styles.button}
          onClick={handlePageDecrement}>
          Previous
        </button>

        <p className={styles.text + ' hide-on-print'}>
          Page {currentPage} of {numberOfPages}
        </p>

        <button
          type="button"
          onClick={handlePageIncrement}
          disabled={currentPage === numberOfPages}
          className={currentPage === numberOfPages ? styles.buttonDisabled : styles.button}>
          Next
        </button>
      </div>
    </div>
  );
}
