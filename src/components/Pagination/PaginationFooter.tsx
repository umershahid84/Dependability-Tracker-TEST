export type PaginationFooterProps = {
  currentPage: number;
  numberOfPages: number;
  handlePageIncrement: (e: React.SyntheticEvent) => void;
  handlePageDecrement: (e: React.SyntheticEvent) => void;
};

const styles = {
  text: `text-primary print:text-black`,
  button: `p-3 bg-tertiary rounded-md text-xs hover:bg-secondary`,
  buttonContainer: `w-full h-auto  flex flex-wrap flex-row justify-between items-center hide-on-print`,
  buttonDisabled: `p-3 bg-tertiary rounded-md text-xs hover:bg-secondary cursor-not-allowed`
};

export function PaginationFooter({
  currentPage,
  numberOfPages,
  handlePageIncrement,
  handlePageDecrement
}: Readonly<PaginationFooterProps>): React.JSX.Element {
  return (
    <div className={styles.buttonContainer}>
      <button
        type="button"
        disabled={currentPage === 1}
        className={currentPage === 1 ? styles.buttonDisabled : styles.button}
        onClick={handlePageDecrement}>
        Previous
      </button>

      <p className="text-primary print:text-black">
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
  );
}
