import {ClientAPI} from '../client-api';
import {useIsMounted} from './isMounted';
import {useEffect, useState} from 'react';
import {LeaveTypeAttributes} from '../lib/db/models/LeaveType';

export type UseLeaveTypes = {
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  leaveTypes: LeaveTypeAttributes[] | null;
};

export function useLeaveTypes(): UseLeaveTypes {
  const isMounted = useIsMounted();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [leaveTypes, setLeaveTypes] = useState<LeaveTypeAttributes[] | null>(null);

  const fetchLeaveTypes = async () => {
    try {
      const data: LeaveTypeAttributes[] = await ClientAPI.LeaveTypes.Read();

      setLeaveTypes(data ?? []);
      setIsLoading(false);
    } catch (error) {
      setError(String(error));
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isMounted) {
      (async () => {
        setIsLoading(true);
        try {
          await fetchLeaveTypes();
        } catch (error) {
          setError(String(error));
        }
      })();
    }
  }, [isMounted]);

  return {isLoading, error, refetch: fetchLeaveTypes, leaveTypes};
}
