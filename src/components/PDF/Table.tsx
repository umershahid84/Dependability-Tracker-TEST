import React from 'react';
import {getTime, getTimeNoSeconds, makeDate} from '../../lib/utils';
import {CallOutWithAssociations} from '../../lib/db/models/Callout';
import {Page, Text, View, Document, StyleSheet} from '@react-pdf/renderer';
import {EmployeeCalendarProjection} from '../../client-api/employees';

// Define styles
const styles = StyleSheet.create({
  page: {
    padding: 20,
    backgroundColor: '#ffffff'
  },
  table: {
    width: '100%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#000'
  },
  tableRow: {
    flexDirection: 'row'
  },
  tableCell: {
    flex: 1,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#000',
    padding: 5,
    fontSize: 10,
    textAlign: 'left',
    flexDirection: 'column',
    justifyContent: 'center',
    alignContent: 'center',
    width: 'auto'
  },
  header: {
    backgroundColor: '#f0f0f0',
    fontWeight: 'bold',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignContent: 'center'
  },
  subCell: {
    fontSize: 8,
    color: '#888'
  },
  heading: {fontSize: 16, marginBottom: 20, textAlign: 'center'}
  ,
  calendarContainer: {
    marginTop: 10,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#000',
    padding: 6
  },
  calendarDayText: {
    fontSize: 8,
    marginBottom: 2
  }
});

// Define table data
const headings = [
  'Employee Name',
  'Call Date',
  'Shift Date',
  'Leave Type',
  'Created By',
  'Edited By',
  'Supervisor Comments'
];

const TablePdfDocument = ({
  callOuts,
  calendar
}: {
  callOuts: CallOutWithAssociations[];
  calendar?: EmployeeCalendarProjection | null;
}) => (
  <Document>
    <Page size={'A4'} style={styles.page} orientation="landscape">
      <Text style={styles.heading}>Detailed Callout History</Text>
      <View style={styles.table}>
        {/* Table Header */}
        <View style={[styles.tableRow, styles.header]}>
          {headings.map((heading, index) => (
            <View key={index} style={styles.tableCell}>
              <Text style={{fontWeight: 'extrabold', textAlign: 'center'}}>{heading}</Text>
            </View>
          ))}
        </View>
        {/* Table Body */}
        {callOuts.map((callOut, rowIndex) => (
          <View key={rowIndex} style={styles.tableRow}>
            <View style={styles.tableCell}>
              <Text>{callOut.employee?.name}</Text>
            </View>
            <View style={styles.tableCell}>
              <Text>
                {makeDate(callOut.callout_date).toLocaleDateString('en-US', {timeZone: 'UTC'})}
              </Text>
              <Text style={styles.subCell}>{`Call Time: ${getTime(callOut.callout_time)}`}</Text>
            </View>
            <View style={styles.tableCell}>
              <Text>
                {makeDate(callOut.shift_date).toLocaleDateString('en-US', {timeZone: 'UTC'})}
                {callOut.shift_date_to
                  ? ` - ${makeDate(callOut.shift_date_to).toLocaleDateString('en-US', {timeZone: 'UTC'})}`
                  : ''}
              </Text>
              <Text style={styles.subCell}>{`Shift Time: ${getTimeNoSeconds(callOut.shift_time)}`}</Text>
            </View>
            <View style={styles.tableCell}>
              <Text>{callOut.leaveType?.reason}</Text>
              <Text style={styles.subCell}>
                {`${(callOut?.arrived_late_mins ?? 0) > 0 ? `Arrived Late: ${callOut?.arrived_late_mins ?? 0} mins` : ''} ${(callOut?.left_early_mins ?? 0) > 0 ? `Left Early: ${callOut?.left_early_mins ?? 0} mins` : ''}`}
              </Text>
            </View>
            <View style={styles.tableCell}>
              <Text>{callOut.supervisor?.supervisor_info?.name}</Text>
            </View>
            <View style={styles.tableCell}>
              <Text>{callOut.editedBySupervisor?.supervisor_info?.name ?? '-'}</Text>
              {callOut.editedBySupervisor && (
                <Text style={styles.subCell}>{`${makeDate(callOut.updatedAt).toLocaleDateString(
                  'en-US',
                  {timeZone: 'UTC'}
                )} @ ${getTime(callOut.updatedAt)}`}</Text>
              )}
            </View>
            <View style={styles.tableCell}>
              <Text wrap>
                {callOut.supervisor_comments !== ' ' ? callOut.supervisor_comments : 'N/A'}
              </Text>
            </View>
          </View>
        ))}
      </View>
      {calendar && (
        <View style={styles.calendarContainer}>
          <Text style={{fontSize: 10, marginBottom: 4}}>
            Employee Calendar ({calendar.startDate} to {calendar.endDate})
          </Text>
          <View style={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap'}}>
            {calendar.days.map(day => (
              <Text key={day.date} style={styles.calendarDayText}>
                {day.date}: {day.isCallOut ? 'Call-out' : day.isDayOff ? 'Day off' : 'Work day'}{'  '}
              </Text>
            ))}
          </View>
        </View>
      )}
    </Page>
  </Document>
);

export default TablePdfDocument;
