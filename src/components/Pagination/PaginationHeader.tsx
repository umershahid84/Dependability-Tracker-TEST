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
  text: `text-gray-300 print:text-black`,
  button: `p-3 bg-gray-800 rounded-md text-xs hover:bg-gray-700`,
  buttonContainer: `w-auto flex flex-row justify-between items-center gap-8 hide-on-print`,
  header: `w-full h-auto flex flex-wrap flex-row justify-between items-center cursor-pointer`,
  buttonDisabled: `p-3 bg-gray-800 rounded-md text-xs hover:bg-gray-700 cursor-not-allowed`
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
      <p className={styles.text}>
        Showing {showing} to {ending} of {totalNumberOfRecords ?? 0} records
      </p>

      <p className={styles.text + ' hide-on-print'}>
        Page {currentPage} of {numberOfPages}
      </p>

      <div className={styles.buttonContainer}>
        <button
          type="button"
          disabled={currentPage === 1}
          className={currentPage === 1 ? styles.buttonDisabled : styles.button}
          onClick={handlePageDecrement}>
          Previous
        </button>
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
