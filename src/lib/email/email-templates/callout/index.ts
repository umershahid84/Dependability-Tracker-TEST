import {CallOutWithAssociations} from '../../../db/models/Callout';

export const callOutDetailsTemplate = (callOutDetails: CallOutWithAssociations): string => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Call Out Details - ${
          callOutDetails.employee.name
        } - ${callOutDetails.createdAt.toLocaleTimeString()}</title>
    </head>
    <body style="font-family: Arial, sans-serif; background-color: rgb(2, 6, 23); color: #e2e2e2; margin: 0; padding: 0;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: rgb(2, 6, 23); width: 100%; height: 100%; margin: 0; padding: 20px 0;">
            <tr>
                <td align="center" style="padding: 0; margin: 0;">
                    <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="background-color: rgb(30, 41, 59); border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); padding: 20px; width: 100%; max-width: 600px;">
                        <tr>
                            <td align="center" style="padding: 20px;">
                              <img
                                src="https://www.portseattle.org/themes/portseattleflysea/logo.svg"
                                alt="Dependability Tracker Logo"
                                style="
                                    max-width: 350px;
                                    border-radius: 5px;
                                    filter: invert(1) hue-rotate(180deg) saturate(1.5);
                                " />
                                <h2 style="color: #e2e2e2; margin-top: 35px; font-size: 24px; font-weight: 600;">Dependability Tracker</h2>
                            </td>
                        </tr>
                        <tr>
                            <td align="left" style="padding: 20px;">
                                <h1 style="font-size: 24px; color: #e2e2e2; margin-bottom: 20px;">Call-Out received for ${
                                  callOutDetails.employee.name
                                }</h1>
                                <p style="margin-bottom: 20px;">Details:</p>
                                <table width="100%" border="1" cellspacing="0" cellpadding="5" style="border-collapse: collapse; margin-bottom: 20px;">
                                    <thead style="background-color: #1e293b;">
                                        <tr>
                                            <th style="padding: 8px 16px; border: 1px solid #4b5563; text-align: left; color: #e2e2e2;">Employee Name</th>
                                            <th style="padding: 8px 16px; border: 1px solid #4b5563; text-align: left; color: #e2e2e2;">Call Date</th>
                                            <th style="padding: 8px 16px; border: 1px solid #4b5563; text-align: left; color: #e2e2e2;">Shift Date</th>
                                            <th style="padding: 8px 16px; border: 1px solid #4b5563; text-align: left; color: #e2e2e2;">Leave Type</th>
                                            <th style="padding: 8px 16px; border: 1px solid #4b5563; text-align: left; color: #e2e2e2;">Created By</th>
                                            <th style="padding: 8px 16px; border: 1px solid #4b5563; text-align: left; color: #e2e2e2;">Supervisor Comments</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td style="padding: 8px 16px; border: 1px solid #4b5563; color: #e2e2e2;">${
                                              callOutDetails.employee.name
                                            }</td>
                                            <td style="padding: 8px 16px; border: 1px solid #4b5563; color: #e2e2e2;">
                                                ${callOutDetails.callout_date.toLocaleDateString()}
                                                <div style="color: #6b7280; font-size: 12px; white-space: nowrap;">
                                                    Call Time: ${callOutDetails.callout_time.toLocaleTimeString()}
                                                </div>
                                            </td>
                                            <td style="padding: 8px 16px; border: 1px solid #4b5563; color: #e2e2e2;">
                                                ${callOutDetails.shift_date.toLocaleDateString()}
                                                <div style="color: #6b7280; font-size: 12px; white-space: nowrap;">
                                                    Shift Time: ${callOutDetails.shift_time.toLocaleTimeString(
                                                      [],
                                                      {hour: '2-digit', minute: '2-digit'}
                                                    )}
                                                </div>
                                            </td>
                                            <td style="padding: 8px 16px; border: 1px solid #4b5563; color: #e2e2e2;">
                                                ${callOutDetails.leaveType.reason}
                                                <div style="color: #6b7280; font-size: 12px; white-space: nowrap;">
                                                    ${
                                                      (callOutDetails.left_early_mins ?? 0) > 0
                                                        ? `Left Early: ${callOutDetails.left_early_mins} mins`
                                                        : ''
                                                    }
                                                    ${
                                                      (callOutDetails.arrived_late_mins ?? 0) > 0
                                                        ? `Arrived Late: ${callOutDetails.arrived_late_mins} mins`
                                                        : ''
                                                    }
                                                </div>
                                            </td>
                                            <td style="padding: 8px 16px; border: 1px solid #4b5563; color: #e2e2e2;">${
                                              callOutDetails.supervisor.supervisor_info.name
                                            }</td>
                                            <td style="padding: 8px 16px; border: 1px solid #4b5563; color: #e2e2e2;">
                                                ${
                                                  callOutDetails.supervisor_comments !== ' '
                                                    ? callOutDetails.supervisor_comments
                                                    : 'N/A'
                                                }
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
  `;
};
