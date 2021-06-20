module.exports = (link, text, title, subject) => {
    return `
    <body style="font-family: sans-serif; font-size: 15px; margin: 0; padding: 0;">
        <table bgcolor="#eef0f4" cellpadding="0" cellspacing="0" width="100%" style="min-width: 320px;">
            <tbody>
                <tr>
                    <td style="padding: 20px 0 20px 0;">
                        <table align="center" cellpadding="0" cellspacing="0" width="600" style="margin: 0 auto 0 auto; max-width: 600px; width: 100% !important;">
                            <tbody>
                                <tr>
                                    <td bgcolor="#ffffff" style="border-radius: 25px;">
                                        <table cellpadding="0" cellspacing="0" width="100%">
                                            <tbody>
                                                <tr>
                                                    <td style="border-bottom-color: #eceeef; border-bottom-style: solid; border-bottom-width: 1px; padding: 25px 20px 25px 20px;">
                                                        <table cellpadding="0" cellspacing="0" width="100%">
                                                            <tbody>
                                                                <tr>
                                                                    <td width="160" style="max-width: 160px; width: 160px;">
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td style="padding: 20px 20px 0px 20px;">
                                                        <table align="center" cellpadding="0" cellspacing="0" style="margin: 0 auto 0 auto; width: 100%;">
                                                            <tbody>
                                                                <tr>
                                                                    <td style="padding: 0 0 0px 0;">
                                                                        <table cellpadding="0" cellspacing="0" width="100%">
                                                                            <tbody>
                                                                                <tr>
                                                                                    <td style="color: #333; font-size: 24px; font-weight: bold; font-family: 'arial', 'helvetica', sans-serif; padding: 0 0 10px 0; line-height: 1.5em;">
                                                                                        ${subject}
                                                                                    </td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td style="color: #333; font-size: 16px; font-family: 'arial', 'helvetica', sans-serif; padding: 20px 0 20px 0; line-height: 1.5em;">
                                                                                        ${text}
                                                                                    </td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td style="color: #333; font-size: 16px; font-family: 'arial', 'helvetica', sans-serif; padding: 10px 0 22px 0; line-height: 1.7em;">
                                                                                        <a href="${link}" style="display: block; background: #0365ca; text-align: center; color: #fff; text-decoration: none; padding: 6px 0; border-radius: 5px;" title="Подтвердить почту">
                                                                                            ${title}
                                                                                        </a>
                                                                                    </td>
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </td>
                </tr>
            </tbody>
        </table>
    </body>
    `;
}
