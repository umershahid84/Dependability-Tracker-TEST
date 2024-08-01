import React from 'react';
import { getTime, getTimeNoSeconds, makeDate } from '../../lib/utils';
import { CallOutWithAssociations } from '../../lib/db/models/Callout';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';


// Define styles
const styles = StyleSheet.create({
    page: {
        padding: 20,
        backgroundColor: '#ffffff',
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
        width: 'auto',
    },
    header: {
        backgroundColor: '#f0f0f0',
        fontWeight: 'bold',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignContent: 'center',
    },
    subCell: {
        fontSize: 8,
        color: '#888',
    },
    heading: { fontSize: 16, marginBottom: 20, textAlign: 'center' }

});

// Define table data
const headings = [
    'Employee Name',
    'Call Date',
    'Shift Date',
    'Leave Type',
    'Created By',
    'Supervisor Comments'
];

const TablePdfDocument = ({ callOuts }: { callOuts: CallOutWithAssociations[] }) => (
    <Document>
        <Page size={'A4'} style={styles.page} orientation='landscape'>
            <Text style={styles.heading}>
                Detailed Callout History
            </Text>
            <View style={styles.table} >
                {/* Table Header */}
                <View style={[styles.tableRow, styles.header]}>
                    {headings.map((heading, index) => (
                        <View key={index} style={styles.tableCell}>
                            <Text style={{ fontWeight: 'extrabold', textAlign: 'center' }}>{heading}</Text>
                        </View>
                    ))}
                </View>
                {/* Table Body */}
                {callOuts.map((callOut, rowIndex) => (
                    <View key={rowIndex} style={styles.tableRow} >
                        <View style={styles.tableCell}>
                            <Text>{callOut.employee?.name}</Text>
                        </View>
                        <View style={styles.tableCell}>
                            <Text>{makeDate(callOut.callout_date).toLocaleDateString()}</Text>
                            <Text style={styles.subCell}>{`Call Time: ${getTime(callOut.callout_time)}`}</Text>
                        </View>
                        <View style={styles.tableCell}>
                            <Text>{makeDate(callOut.shift_date).toLocaleDateString()}</Text>
                            <Text style={styles.subCell}>{`Shift Time: ${getTimeNoSeconds(callOut.shift_time)}`}</Text>
                        </View>
                        <View style={styles.tableCell}>
                            <Text>{callOut.leaveType?.reason}</Text>
                            <Text style={styles.subCell}>
                                {`${(callOut?.left_early_mins ?? 0) > 0 ? `Left Early: ${callOut?.left_early_mins ?? 0} mins` : ''} ${(callOut?.arrived_late_mins ?? 0) > 0 ? `Arrived Late: ${callOut?.arrived_late_mins ?? 0} mins` : ''}`}
                            </Text>
                        </View>
                        <View style={styles.tableCell}>
                            <Text>{callOut.supervisor?.supervisor_info?.name}</Text>
                        </View>
                        <View style={styles.tableCell}>
                            <Text wrap>{callOut.supervisor_comments !== ' ' ? callOut.supervisor_comments : 'N/A'}</Text>
                        </View>
                    </View>
                ))}
            </View>
        </Page>
    </Document>
);

export default TablePdfDocument;