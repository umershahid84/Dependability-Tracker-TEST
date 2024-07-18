import {useEffect} from 'react';
import {FormLabel} from '../../../FormLabel';
import {useRangeOptionsStateMap} from './useRangeOptionsVariantMap';
import {FormLabelContainer} from '../../../EmployeeModal/FormLayout';
import {RangeOptionsProps, rangeOptionsStyles, rangeOptionsVariantMap} from './data';
import {UseDbSearchParamsFormState} from '../../../../CallOuts/CallOutsList/helpers';

const {
  time,
  type,
  label,
  value,
  range,
  inputType,
  optionValues,
  valueFormatter,
  dbSearchParamsName,
  timeRangeOptionLabel,
  dbSearchParam_NonRange
} = rangeOptionsVariantMap;

export function RangeOptions({
  variant,
  originalParams,
  clearRangeOptions,
  dbSearchParamsFormState
}: Readonly<RangeOptionsProps>) {
  const stateOptionsVariantMap = useRangeOptionsStateMap(originalParams);

  // clears the Advanced Search Options and the originalParams
  // we use two different states to keep track of the search params rather than one source of truth
  // this allows the user to make changes to the advanced search options without affecting the originalParams until
  // they click the search button. On Clear immediately clears the search params and the originalParams and will
  // refetch data from the server.
  const handleOnClear = () => {
    stateOptionsVariantMap[variant].setOptionValue(null);
    stateOptionsVariantMap[variant].setRangeValue({});

    originalParams.setSearchParams(prev => {
      return {
        ...prev,
        [dbSearchParamsName[variant]]: undefined,
        [rangeOptionsVariantMap.dbSearchParam_NonRange[variant]]: undefined
      };
    });
  };

  // updates the form state when the range value changes
  useEffect(() => {
    if (
      stateOptionsVariantMap[variant].rangeValue.start &&
      stateOptionsVariantMap[variant].rangeValue.end
    ) {
      dbSearchParamsFormState.handleSearchParamsChange({
        target: {
          name: dbSearchParamsName[variant],
          value: [
            stateOptionsVariantMap[variant].rangeValue.start,
            stateOptionsVariantMap[variant].rangeValue.end
          ]
        }
      } as unknown as React.ChangeEvent<HTMLInputElement>);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stateOptionsVariantMap[variant].rangeValue]);

  useEffect(() => {
    if (clearRangeOptions) {
      handleOnClear();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clearRangeOptions]);

  return (
    <FormLabelContainer addClasses={rangeOptionsStyles.relative}>
      <label htmlFor={label[variant]} className={rangeOptionsStyles.label}>
        {stateOptionsVariantMap[variant].optionValue
          ? timeRangeOptionLabel[variant]['true']
          : timeRangeOptionLabel[variant]['false']}
      </label>
      {!stateOptionsVariantMap[variant].optionValue ? (
        <select
          name={label[variant]}
          title={label[variant]}
          className={rangeOptionsStyles.input}
          onChange={stateOptionsVariantMap[variant].handleOptionChange}>
          <option value="">{value[variant]}</option>
          <option value={optionValues[variant][0]}>{time[variant]}</option>
          <option value={optionValues[variant][1]}>{range[variant]}</option>
        </select>
      ) : (
        <div className={rangeOptionsStyles.optionsContainer}>
          <button type="button" onClick={handleOnClear} className={rangeOptionsStyles.clearButton}>
            Clear
          </button>

          {stateOptionsVariantMap[variant].optionValue &&
          stateOptionsVariantMap[variant].optionValue === optionValues[variant][0] ? (
            <div className={rangeOptionsStyles.col90}>
              <FormLabel
                label={label[variant]}
                className={rangeOptionsStyles.formLabelMt}
                htmlFor={dbSearchParam_NonRange[variant]}
              />
              <input
                title={label[variant]}
                className={rangeOptionsStyles.input}
                type={inputType[variant]}
                name={dbSearchParam_NonRange[variant]}
                value={valueFormatter[variant](
                  (dbSearchParamsFormState.searchParams[
                    dbSearchParam_NonRange[
                      variant
                    ] as keyof UseDbSearchParamsFormState['searchParams']
                  ] as any) ?? ''
                )}
                onChange={dbSearchParamsFormState.handleSearchParamsChange}
              />
            </div>
          ) : (
            <></>
          )}

          {stateOptionsVariantMap[variant].optionValue &&
          stateOptionsVariantMap[variant].optionValue === optionValues[variant][1] ? (
            <div className={rangeOptionsStyles.col90}>
              <FormLabel label={`${type[variant]} Range`} htmlFor="" />
              <span className={rangeOptionsStyles.rangeLabelSpan}>
                <FormLabel
                  label="Start"
                  htmlFor="start"
                  className={rangeOptionsStyles.formLabelMr}
                />
              </span>

              <input
                name="start"
                className={rangeOptionsStyles.input}
                type={inputType[variant]}
                title={`${type[variant]} Range Start Time`}
                onChange={stateOptionsVariantMap[variant].handleRangeChange}
                value={
                  valueFormatter[variant](
                    stateOptionsVariantMap[variant].rangeValue.start as any
                  ) ?? ''
                }
              />
              <span className={rangeOptionsStyles.rangeLabelSpan}>
                <FormLabel label="End" htmlFor="end" className={rangeOptionsStyles.formLabelMr} />
              </span>
              <input
                name="end"
                className={rangeOptionsStyles.input}
                type={inputType[variant]}
                title={`${type[variant]} Range End Time`}
                onChange={stateOptionsVariantMap[variant].handleRangeChange}
                value={
                  valueFormatter[variant](stateOptionsVariantMap[variant].rangeValue.end as any) ??
                  ''
                }
              />
            </div>
          ) : (
            <></>
          )}
        </div>
      )}
    </FormLabelContainer>
  );
}
